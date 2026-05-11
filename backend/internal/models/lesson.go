package models

import (
	gonanoid "github.com/matoous/go-nanoid/v2"
	"gorm.io/gorm"
)

type Lesson struct {
	ID         string `gorm:"primaryKey;type:varchar(12)" json:"id"`
	Track      string `json:"track"`      // "qa" lub "reality"
	Difficulty string `json:"difficulty"` // "Beginner", "Intermediate", "Advanced"
	Status     string `json:"status"`     // "LIVE", "Coming Soon"

	// Pola wielojęzyczne
	TitleEN    string `json:"title_en"`
	TitlePL    string `json:"title_pl"`
	ContentEN  string `json:"content_en"`
	ContentPL  string `json:"content_pl"`
}

func (l *Lesson) BeforeCreate(tx *gorm.DB) (err error) {
	if l.ID == "" {
		alphabet := "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
		l.ID, err = gonanoid.Generate(alphabet, 12)
	}
	return
}
