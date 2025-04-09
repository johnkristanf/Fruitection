package database

import (
	"errors"
	"fmt"
	"time"

	"github.com/johnkristanf/clamscanner/types"
	"gorm.io/gorm"
)

type Reported_Cases struct {
	ID          		int64   `gorm:"primaryKey;autoIncrement:true;uniqueIndex:idx_reportedID"`
    Longitude   		float32 `gorm:"not null"`
    Latitude    		float32 `gorm:"not null"`
    City        		string  `gorm:"index"` 
    Province    		string  `gorm:"index"` 
    Street    			string  `gorm:"not null"`
    ReportedAt  		string  `gorm:"not null;index"` 
    DurianDiseaseType 	string  
    Status      		string  `gorm:"not null;default:In Progress"`
	
    UserID      		int64   `gorm:"not null"`
    FarmID      		int64   `gorm:"not null"`
}


type REPORTED_DB_METHOD interface {
	InsertReport(*types.Reported_Cases) (int64, error)

	FetchReportedCases(string) ([]*types.Fetch_Cases, error)
	FetchMapReportedCases(string, string, string) ([]*types.Fetch_Cases, error)
	
	FetchPerCityReports() ([]*types.YearlyReportsPerCity, error)
	FetchReportPerFarm() ([]*types.YearlyReportsPerFarm, error)
	FetchReportsPerDurianDisease() ([]*types.ReportsPerDurianDisease, error)
	
	DeleteReportCases(int64) error
	UpdateReportStatus(int64) error
}

type Farms struct {
	ID          int64   `gorm:"primaryKey;autoIncrement:true;uniqueIndex:idx_reportedID"`
	Name        string  `gorm:"not null"`
	Count       int64   `gorm:"not null;default:0"`  

	CreatedAt 		time.Time `gorm:"not null;autoCreateTime"`	

}


func (sql *SQL) InsertReport(reportCases *types.Reported_Cases) (int64, error) {

	location, err := time.LoadLocation("Asia/Manila")
    if err != nil {
        return 0, err
    }

	fmt.Println("reportCases.FarmName: ", reportCases.FarmName)


	// var farmID int64 = 2 // Default FarmID

    // if reportCases.FarmName != "Unknown Farm" {
    //     var err error
    //     farmID, err = UpdateFarmReportCount(sql.DB, reportCases.FarmName)
    //     if err != nil {
    //         fmt.Println("Error updating farms count:", err)
    //         // Handle error appropriately, possibly returning an error or logging
    //     }
    // }

    
	reportCases.FarmName = "Maduao Farm"

	farmID, err := UpdateFarmReportCount(sql.DB, reportCases.FarmName)
    if err != nil {
        return 0, err
	}

	fmt.Println("farmID: ", farmID)



	reportedAt := time.Now().In(location).Format("January 2, 2006 03:04 PM")

	reportedCases := &Reported_Cases{
		Longitude:   reportCases.Longitude,
		Latitude:    reportCases.Latitude,
		City:        reportCases.City,
		Province:    reportCases.Province,
		Street:    reportCases.Street,
		ReportedAt:  reportedAt,
		DurianDiseaseType: reportCases.DurianDiseaseType,

		UserID:      reportCases.UserID,
		FarmID: 	 farmID,	
	}

	result := sql.DB.Create(reportedCases)
	if result.Error != nil {
		return 0, result.Error
	}

	
	lastInsertedID := reportedCases.ID

	

	return lastInsertedID, nil
}


func (sql *SQL) FetchReportedCases(farmName string) ([]*types.Fetch_Cases, error) {
    var cases []*types.Fetch_Cases

    query := sql.DB.Table("reported_cases").
        Select(`reported_cases.id, reported_cases.longitude, reported_cases.latitude, reported_cases.city, reported_cases.province, reported_cases.street, reported_cases.reported_at, reported_cases.durian_disease_type, reported_cases.status, users.id AS user_id, users.full_name AS reporter_name, users.address AS reporter_address`).
        Joins("INNER JOIN users ON reported_cases.user_id = users.id").
        Joins("INNER JOIN farms ON reported_cases.farm_id = farms.id")

    if farmName != "All" {
        query = query.Where("farms.name = ?", farmName)
    }

    result := query.Order("reported_cases.id DESC").Find(&cases)

    if result.Error != nil {
        return nil, result.Error
    }

    return cases, nil
}



func (sql *SQL) FetchMapReportedCases(year string, month string, durian string) ([]*types.Fetch_Cases, error) {
    var cases []*types.Fetch_Cases

    query := sql.DB.Table("reported_cases").
        Select(`reported_cases.id, reported_cases.longitude, reported_cases.latitude, reported_cases.city, reported_cases.province, reported_cases.street, reported_cases.reported_at, reported_cases.durian_disease_type, reported_cases.status,
        users.id AS user_id, users.full_name AS reporter_name, users.address AS reporter_address`).
        Joins("INNER JOIN users ON reported_cases.user_id = users.id")

	if year != "All" {
		query = query.Where("EXTRACT(YEAR FROM TO_TIMESTAMP(reported_at, 'Month DD, YYYY HH12:MI AM')) = ?", year)
	}
		
    if month != "All" {
        query = query.Where("reported_at ILIKE ?", "%"+month+"%")
    }

    if durian != "All" {
        query = query.Where("durian_disease_type = ?", durian)
    }

    result := query.Find(&cases)

    if result.Error != nil {
        return nil, result.Error
    }

    fmt.Println("cases in db: ", cases)

    return cases, nil
}



func (sql *SQL) FetchPerCityReports() ([]*types.YearlyReportsPerCity, error) {

	var yearlyReports []*types.YearlyReportsPerCity

	result := sql.DB.Table("reported_cases").
		Select(`city, EXTRACT(YEAR FROM TO_TIMESTAMP(reported_at, 'Month DD, YYYY HH:MI PM')) AS year, COUNT(id) AS reports_count`).
		Group("city, year").
		Find(&yearlyReports);

		if result.Error != nil {
			return nil, result.Error
		}	

	return yearlyReports, nil
	
}


func (sql *SQL) FetchReportPerFarm() ([]*types.YearlyReportsPerFarm, error) {
	
	var yearlyReports []*types.YearlyReportsPerFarm

	result := sql.DB.Table("farms").
		Select("farms.name, CAST(SUBSTR(reported_cases.reported_at, 11, 4) AS INTEGER) as year, farms.count").
		Joins("LEFT JOIN reported_cases ON farms.id = reported_cases.farm_id").
		Group("farms.name, CAST(SUBSTR(reported_cases.reported_at, 11, 4) AS INTEGER), farms.count").
		Order("year DESC").
		Scan(&yearlyReports)

	if result.Error != nil {
		return nil, result.Error
	}	
		

	return yearlyReports, nil
}


func (sql *SQL) FetchReportsPerDurianDisease() ([]*types.ReportsPerDurianDisease, error){

	var reports []*types.ReportsPerDurianDisease

	result := sql.DB.Table("reported_cases").
		Select("durian_disease_type, COUNT(id) AS durian_disease_count").
		Group("durian_disease_type").
		Find(&reports)

	if result.Error != nil{
		return nil, result.Error
	}	
	
	return reports, nil
}


func (sql *SQL) DeleteReportCases(report_id int64) error {

	query := "DELETE FROM reported_cases WHERE id = ?"
	if err := sql.DB.Exec(query, report_id).Error; err != nil {
		return err
	}

	return nil
}


func (sql *SQL) UpdateReportStatus(report_id int64) error {

	result := sql.DB.Table("reported_cases").Where("id = ?", report_id).Update("status", "Resolved")
	if result.Error != nil{
		return result.Error 
	}

	return nil
}


func UpdateFarmReportCount(DB *gorm.DB, farm string) (int64, error) {
	query := "UPDATE farms SET count = count + 1 WHERE name = ?"
	result := DB.Exec(query, farm)
	if result.Error != nil {
			return 0, result.Error
	}

	if result.RowsAffected == 0 {
		return 0, errors.New("farm not found or no rows updated")
	}

	var id int64
	query = "SELECT id FROM farms WHERE name = ?"
	if err := DB.Raw(query, farm).Scan(&id).Error; err != nil {
		return 0, err
	}

	return id, nil
}



// func stubReports(reportCases *types.Reported_Cases) (reports []*Reported_Cases) {

// 	reportedAt := time.Now().Format("January 2, 2006 03:04 PM")

// 	reportedCases := &Reported_Cases{
// 		Longitude:   reportCases.Longitude,
// 		Latitude:    reportCases.Latitude,
// 		City:        reportCases.City,
// 		Province:    reportCases.Province,
// 		District:    reportCases.District,
// 		ReportedAt:  reportedAt,
// 		MolluskType: reportCases.MolluskType,
// 		UserID:      reportCases.UserID,
// 	}

// 	reports = append(reports, reportedCases)

// 	return reports
// }

// func (sql *SQL) BulkInsertReports(batching_size int, reportCases *types.Reported_Cases) (lastInsertedIDs []int64, err error) {

// 	reports := stubReports(reportCases)
// 	tx := sql.DB.Begin()

// 	chunkList := funk.Chunk(reports, batching_size)

// 	for _, chunk := range chunkList.([][]*Reported_Cases) {
// 		valueStrings := []string{}
// 		valueArgs := []interface{}{}

// 		for _, report := range chunk {
// 			valueStrings = append(valueStrings, "(?, ?, ?, ?, ?, ?, ?, ?)")
// 			valueArgs = append(valueArgs, report.Longitude)
// 			valueArgs = append(valueArgs, report.Latitude)
// 			valueArgs = append(valueArgs, report.City)
// 			valueArgs = append(valueArgs, report.Province)
// 			valueArgs = append(valueArgs, report.District)
// 			valueArgs = append(valueArgs, report.ReportedAt)
// 			valueArgs = append(valueArgs, report.MolluskType)
// 			valueArgs = append(valueArgs, reportCases.UserID)
// 		}

// 		stmt := fmt.Sprintf("INSERT INTO reported_cases (longitude, latitude, city, province, district, reported_at, mollusk_type, user_id) VALUES %s RETURNING id", strings.Join(valueStrings, ","))

// 		rows, err := tx.Raw(stmt, valueArgs...).Rows()
// 		if err != nil {
// 			tx.Rollback()
// 			return nil, err
// 		}

// 		defer rows.Close()

// 		for rows.Next() {
// 			var lastInsertedID int64

// 			if err = rows.Scan(&lastInsertedID); err != nil {
// 				tx.Rollback()
// 				return nil, err
// 			}

// 			lastInsertedIDs = append(lastInsertedIDs, lastInsertedID)
// 		}

// 	}

// 	if err = tx.Commit().Error; err != nil {
// 		return nil, err
// 	}

// 	return lastInsertedIDs, nil
// }