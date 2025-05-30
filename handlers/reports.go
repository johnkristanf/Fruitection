package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"
	"encoding/json"
	"math/rand"

	"github.com/gorilla/websocket"
	"github.com/xuri/excelize/v2"

	"github.com/johnkristanf/clamscanner/database"
	"github.com/johnkristanf/clamscanner/helpers"
	"github.com/johnkristanf/clamscanner/middlewares"
	"github.com/johnkristanf/clamscanner/types"
)

type ReportHandler struct {
	DB_METHOD    database.REPORTED_DB_METHOD
	JSON_METHOD  helpers.JSON_METHODS
	JWT_METHOD   middlewares.JWT_METHOD
	REDIS_METHOD middlewares.REDIS_METHOD
}

func WsOrigin(r *http.Request) bool {
	return true
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     WsOrigin,
}

type Client struct {
	conn *websocket.Conn
}

type RetryConfig struct {
	MaxRetries      int
	InitialInterval time.Duration
	MaxInterval     time.Duration
	BackoffFactor   float64
}

type RetryStrategy func(int) time.Duration

var retryConfig = RetryConfig{
	MaxRetries:      5,
	InitialInterval: 1 * time.Second,
	MaxInterval:     10 * time.Second,
	BackoffFactor:   2,
}

var clients = make(map[*Client]bool)
var retryStrategy = ExponentialBackoffWithJitter(retryConfig.InitialInterval, retryConfig.MaxInterval, retryConfig.BackoffFactor)


func SendReportID(w http.ResponseWriter, r *http.Request, lastInsertedID int64) error {

	for client := range clients {

		if err := client.conn.WriteJSON(lastInsertedID); err != nil {

			newConn, err := WSConnectWithRetry(w, r, retryConfig, retryStrategy)
			if err != nil{
				return fmt.Errorf("error in websocket connection %v", err)
			}
		
			client.conn = newConn
			clients[client] = true
		}
	}

	return nil
}


func ExponentialBackoffWithJitter(initialInterval, maxInterval time.Duration, backOffFactor float64) RetryStrategy {
	return func(attempt int) time.Duration {
		baseInterval := float64(initialInterval) * (backOffFactor * float64(attempt))

		if baseInterval > float64(maxInterval) {
			baseInterval = float64(maxInterval)
		}

		jitter := rand.Float64() * float64(initialInterval)
		intervalWithJitter := baseInterval + jitter

		return time.Duration(intervalWithJitter)
	}
}

func WSConnectWithRetry(w http.ResponseWriter, r *http.Request, retryConfig RetryConfig, retryStrategy RetryStrategy) (conn *websocket.Conn, err error) {
	conn, err = upgrader.Upgrade(w, r, nil)
	if err == nil {
		return conn, nil
	}

	for attempt := 1; attempt <= retryConfig.MaxRetries; attempt++ {
		retryInterval := retryStrategy(attempt)
		fmt.Printf("Retrying in %s...\n", retryInterval)
		time.Sleep(retryInterval)

		conn, err = upgrader.Upgrade(w, r, nil)
		if err == nil {
			fmt.Println("Connected successfully")
			return conn, nil
		}
		fmt.Printf("Attempt %d failed: %v\n", attempt, err)
	}

	return nil, fmt.Errorf("failed to connect after %d attempts", retryConfig.MaxRetries)
}

func (h *ReportHandler) WebsocketConnHandler(w http.ResponseWriter, r *http.Request) error {

	conn, err := WSConnectWithRetry(w, r, retryConfig, retryStrategy)
	if err != nil {
		return fmt.Errorf("error in websocket connection %v", err)
	}

	client := &Client{conn: conn}
	clients[client] = true

	// Handle disconnection
	go func() {
		defer func() {
			client.conn.Close()
			delete(clients, client)
		}()

		for {
			_, _, err := client.conn.ReadMessage()
			if err != nil {
				fmt.Printf("Client disconnected: %v\n", err)
				return
			}
		}
	}()

	return nil
}

// ------------------ END OF WEBSOCKET CONFIGURATIONS----------------------------


func (h *ReportHandler) InsertReportHandler(w http.ResponseWriter, r *http.Request) error {

	var reportedCases types.Reported_Cases
	errorChan := make(chan error, 1)
	lastReportChan := make(chan int64, 1)

	if err := json.NewDecoder(r.Body).Decode(&reportedCases); err != nil{
		return fmt.Errorf("error in json decoding %d", err)
	}

	go func() {

		defer close(errorChan)
		defer close(lastReportChan)

		lastReportedID, err := h.DB_METHOD.InsertReport(&reportedCases)
		if err != nil {
			errorChan <- err
		}

		lastReportChan <- lastReportedID

	}()

	select {

		case err := <-errorChan:
			if err != nil {
				return err
			}

			
		case reportID := <- lastReportChan:

			// reportKeys := [5]string{"reports", "reports_city", "reports_street", "reports_per_mollusk", "reports_map"}

			// if err := h.REDIS_METHOD.DELETEBYKEY(reportKeys, r); err != nil {
			// 	return err
			// }

			if err := SendReportID(w, r, reportID); err != nil {
				return fmt.Errorf("error writing json data to client: %v", err)
			}

	}

	return h.JSON_METHOD.JsonEncode(w, http.StatusOK, "Reported Successfully")
}

func (h *ReportHandler) FetchAllReportsHandler(w http.ResponseWriter, r *http.Request) error {

	var cases []*types.Fetch_Cases

	selectedFarm := r.PathValue("selectedFarm")

	cases, err := h.DB_METHOD.FetchReportedCases(selectedFarm)
	if err != nil {
		return err
	}

		
	return h.JSON_METHOD.JsonEncode(w, http.StatusOK, cases)
}

func (h *ReportHandler) FetchMapReportsHandler(w http.ResponseWriter, r *http.Request) error {

	year := r.PathValue("year")
	month := r.PathValue("month")
	durian := r.PathValue("durian")

	fmt.Println("month: ", month)
	fmt.Println("durian: ", durian)

	var cases []*types.Fetch_Cases
	
	cases, err := h.DB_METHOD.FetchMapReportedCases(year, month, durian)
	if err != nil {
		return err
	}

	
	return h.JSON_METHOD.JsonEncode(w, http.StatusOK, cases)

}

func (h *ReportHandler) FetchYearlyReportByCityHandler(w http.ResponseWriter, r *http.Request) error {

	
		yearlyReports, err := h.DB_METHOD.FetchPerCityReports()
		if err != nil{
			return err
		}


		
		return h.JSON_METHOD.JsonEncode(w, http.StatusOK, yearlyReports)

	
}


func (h *ReportHandler) FetchYearlyReportByFarmHandler(w http.ResponseWriter, r *http.Request) error {

		yearlyReports, err := h.DB_METHOD.FetchReportPerFarm()
		if err != nil{
			return err
		}

		return h.JSON_METHOD.JsonEncode(w, http.StatusOK, yearlyReports)


}

func (h *ReportHandler) FetchReportPerDurianDiseaseHandler(w http.ResponseWriter, r *http.Request) error {
	


		reportsPerMollusk, err := h.DB_METHOD.FetchReportsPerDurianDisease()
		if err != nil{
			return err
		}


	return h.JSON_METHOD.JsonEncode(w, http.StatusOK, reportsPerMollusk)	
}


func (h *ReportHandler) GenerateReportsHandler(w http.ResponseWriter, r *http.Request) error {
	reports, err := h.DB_METHOD.FetchReportsData()
	if err != nil {
		return err
	}

	f := excelize.NewFile()
	defer func() {
		if err := f.Close(); err != nil {
			fmt.Println("Error closing file:", err)
		}
	}()

	sheetName := "Reported Cases"
	index, err := f.NewSheet(sheetName)
	if err != nil {
		fmt.Println("Error creating sheet:", err)
		return err
	}

	// Set headers
	headers := []string{"ID", "Longitude", "Latitude", "City", "Province",  "Reported At", "Durian Disease Type", "Status", "User ID", "Reporter Name", "Reporter Address"}
	for col, header := range headers {
		cell := fmt.Sprintf("%s%d", string('A'+col), 1)
		f.SetCellValue(sheetName, cell, header)
	}

	// Populate data rows
	for rowNum, caseData := range reports {
		row := rowNum + 2 // Start from row 2 after headers

		f.SetCellValue(sheetName, fmt.Sprintf("A%d", row), caseData.ID)
		f.SetCellValue(sheetName, fmt.Sprintf("B%d", row), caseData.Longitude)
		f.SetCellValue(sheetName, fmt.Sprintf("C%d", row), caseData.Latitude)
		f.SetCellValue(sheetName, fmt.Sprintf("D%d", row), caseData.City)
		f.SetCellValue(sheetName, fmt.Sprintf("E%d", row), caseData.Province)
		f.SetCellValue(sheetName, fmt.Sprintf("G%d", row), caseData.ReportedAt) // Format the time
		f.SetCellValue(sheetName, fmt.Sprintf("H%d", row), caseData.DurianDiseaseType)
		f.SetCellValue(sheetName, fmt.Sprintf("I%d", row), caseData.Status)
		f.SetCellValue(sheetName, fmt.Sprintf("J%d", row), caseData.UserID)
		f.SetCellValue(sheetName, fmt.Sprintf("K%d", row), caseData.ReporterName)
		f.SetCellValue(sheetName, fmt.Sprintf("L%d", row), caseData.ReporterAddress)
	}

	f.SetActiveSheet(index)

	// 3. Save the Excel file to a buffer (in memory)
	excelData, err := f.WriteToBuffer()
	if err != nil {
		http.Error(w, "Failed to generate Excel file", http.StatusInternalServerError)
		return err
	}

	// 4. Set HTTP headers for Blob download
	w.Header().Set("Content-Disposition", "attachment; filename=reported_cases.xlsx")
	w.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	w.Header().Set("Content-Length", strconv.Itoa(excelData.Len()))

	// 5. Send the Excel data as the response body
	w.WriteHeader(http.StatusOK)
	_, err = w.Write(excelData.Bytes())
	if err != nil {
		fmt.Println("Error writing response:", err)
	}

	return nil
}



func (h *ReportHandler) UpdateReportStatusHandler(w http.ResponseWriter, r *http.Request) error {

	idParam := r.PathValue("report_id")
	report_id, err := strconv.Atoi(idParam)
	if err != nil {
		return err
	}


	if err := h.DB_METHOD.UpdateReportStatus(int64(report_id)); err != nil {
		return err
	}

	// if err := h.REDIS_METHOD.DELETE("reports", r); err != nil {
	// 	return err
	// }

	return h.JSON_METHOD.JsonEncode(w, http.StatusOK, "Report Status Updated!")

}



func (h *ReportHandler) DeleteReportHandler(w http.ResponseWriter, r *http.Request) error {

	idParam := r.PathValue("report_id")
	report_id, err := strconv.Atoi(idParam)
	if err != nil {
		return err
	}

	if err := h.DB_METHOD.DeleteReportCases(int64(report_id)); err != nil {
		return err
	}

	// reportKeys := [5]string{"reports", "reports_city", "reports_street", "reports_per_mollusk", "reports_map"}

	// if err := h.REDIS_METHOD.DELETEBYKEY(reportKeys, r); err != nil {
	// 	return err
	// }


	return h.JSON_METHOD.JsonEncode(w, http.StatusOK, "Report Deleted")

}


