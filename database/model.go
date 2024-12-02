package database

import (
	"time"

	"github.com/johnkristanf/clamscanner/types"
)

type MODEL_DB_METHOD interface {
	InsertModelDetails(*types.ModelDetails) error
	FetchClassifiedDurianDetails(string) (*types.DurianDetails, error)
	FetchModels() ([]*types.FetchModelDetails, error) 
}

type Model struct {
	ID        		int64     `gorm:"primaryKey;autoIncrement:true;uniqueIndex:idx_modelID"`
	Version  		string    `gorm:"not null"`
	TrainAccuracy   float32   `gorm:"not null"`
	ValAccuracy  	float32   `gorm:"not null"`
	TrainLoss     	float32   `gorm:"not null"`
	ValLoss  		float32   `gorm:"not null"`
	TrainedAt 		time.Time `gorm:"not null;autoCreateTime"`	
}


func (sql *SQL) InsertModelDetails(modelDetails *types.ModelDetails) error {

	model := &Model{
		Version: modelDetails.Version,
		TrainAccuracy: modelDetails.TrainAccuracy,
		ValAccuracy: modelDetails.ValAccuracy,
		TrainLoss: modelDetails.TrainLoss,
		ValLoss: modelDetails.TrainLoss,
	}
	
	if result := sql.DB.Create(&model); result.Error != nil {
		return result.Error
	}

	return nil
}

func (sql *SQL) FetchClassifiedDurianDetails(durianName string) (*types.DurianDetails, error) {

	var details *types.DurianDetails

	result := sql.DB.Select("name, description, status").
		Table("datasets").
		Where("name ILIKE ?", durianName).
		First(&details)

	if result.Error != nil {
		return nil, result.Error
	}

	return details, nil
}




func (sql *SQL) FetchModels() ([]*types.FetchModelDetails, error) {

	var models []*types.FetchModelDetails
	
	query := `	SELECT 
					id, 
					version, 
					train_accuracy, 
					train_loss, 
					to_char(trained_at, 'FMMonth DD, YYYY HH12:MI AM') as trained_at  
				FROM 
					models` 

	if result := sql.DB.Raw(query).Scan(&models); result.Error != nil {
		return nil, result.Error
	}

	return models, nil
}