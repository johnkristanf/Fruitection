package routes

import (
	"net/http"

	"github.com/johnkristanf/clamscanner/handlers"
)

func ReportsRoutes(router *http.ServeMux, reportsHandler *handlers.ReportHandler) {

	adminAuth := reportsHandler.JWT_METHOD.AdminAuthenticateMiddleware
	// mobileAuth := reportsHandler.JWT_METHOD.MobileAuthenticateMiddleware

	router.HandleFunc("GET /ws/conn", ParseHTTPHandler(reportsHandler.WebsocketConnHandler))

	router.HandleFunc("POST /insert/report", ParseHTTPHandler(reportsHandler.InsertReportHandler))

	router.HandleFunc("GET /fetch/reports/{selectedFarm}", ParseHTTPHandler(reportsHandler.FetchAllReportsHandler))
	router.HandleFunc("GET /fetch/map/reports/{year}/{month}/{durian}", ParseHTTPHandler(reportsHandler.FetchMapReportsHandler))
	
	router.HandleFunc("GET /generate/reports", ParseHTTPHandler(reportsHandler.GenerateReportsHandler))

	router.HandleFunc("GET /fetch/reports/city", adminAuth(ParseHTTPHandler(reportsHandler.FetchYearlyReportByCityHandler)))
	router.HandleFunc("GET /fetch/reports/farm", adminAuth(ParseHTTPHandler(reportsHandler.FetchYearlyReportByFarmHandler)))
	router.HandleFunc("GET /fetch/reports/mollusk", adminAuth(ParseHTTPHandler(reportsHandler.FetchReportPerDurianDiseaseHandler)))

	router.HandleFunc("PUT /update/report/status/{report_id}", ParseHTTPHandler(reportsHandler.UpdateReportStatusHandler))
	router.HandleFunc("DELETE /delete/reports/{report_id}", adminAuth(ParseHTTPHandler(reportsHandler.DeleteReportHandler)))
	
}
