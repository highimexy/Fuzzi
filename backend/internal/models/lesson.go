package models

import (
	"time"

	"gorm.io/datatypes"
)

type Lesson struct {
	ID         string         `gorm:"primaryKey;type:varchar(36)" json:"id"`
	Track      string         `json:"track"`
	Difficulty string         `json:"difficulty"`
	Status     string         `json:"status"`
	LessonType string         `json:"lesson_type"`
	TitleEN    string         `json:"title_en"`
	TitlePL    string         `json:"title_pl"`
	ContentEN  string         `json:"content_en"`
	ContentPL  string         `json:"content_pl"`
	PayloadEN  datatypes.JSON `json:"payload_en"`
	PayloadPL  datatypes.JSON `json:"payload_pl"`
}

type LessonProgress struct {
	ID        string    `gorm:"primaryKey;type:varchar(40)" json:"id"`
	UserID    string    `gorm:"type:varchar(50);index" json:"user_id"`
	LessonID  string    `gorm:"type:varchar(20);index" json:"lesson_id"`
	Completed bool      `json:"completed"`
	Score     int       `json:"score"`
	Attempts  int       `json:"attempts"`
	UpdatedAt time.Time `json:"updated_at"`
}
