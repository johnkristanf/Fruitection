package types

type Reported_Cases struct{
	Longitude  			  float32     `json:"longitude"` 
	Latitude 	 		  float32     `json:"latitude"` 
	City  		  		  string 	  `json:"city"` 
	Province  	  		  string      `json:"province"` 
	Street 	  		  	  string      `json:"street"` 
	DurianDiseaseType     string 	  `json:"durian_disease_type"` 
	UserID     			  int64 	  `json:"user_id"` 
	FarmName     		  string 	  `json:"farmName"` 

}


type Fetch_Cases struct{
	ID 				int64		`json:"report_id"` 
	Longitude  		float32     `json:"longitude"` 
	Latitude 	 	float32     `json:"latitude"` 
	City  		  	string 	 	`json:"city"` 
	Province  	  	string      `json:"province"` 
	Street 	  		string      `json:"street"` 
	ReportedAt 		string 		`json:"reportedAt"` 
	DurianDiseaseType     string 		`json:"durian_disease_type"`
    Status      	string  	`json:"status"`
	UserID     		int64 		`json:"user_id"` 

	ReporterName    string 		`json:"reporter_name"` 
	ReporterAddress string 		`json:"reporter_address"` 
}

type YearlyReportsPerCity struct{
	City 		string	`json:"city"` 
	Year 		string	`json:"year"` 
	ReportsCount int64	`json:"reports_count"` 

}

type YearlyReportsPerFarm struct{
	Name 			string	`json:"farm"` 
	Count 			int64	`json:"count"` 
}

type ReportsPerDurianDisease struct {
	DurianDiseaseType			string	`json:"durian_disease_type"` 
	DurianDiseaseCount			int64	`json:"durian_disease_count"` 
}


