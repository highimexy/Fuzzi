package models

import (
	"time"

	gonanoid "github.com/matoous/go-nanoid/v2"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// ─────────────────────────────────────────────
// LESSON GROUP — lekcja główna (kontener)
// ─────────────────────────────────────────────

type LessonGroup struct {
	ID         string `gorm:"primaryKey;type:varchar(12)" json:"id"`
	Track      string `gorm:"type:varchar(20);index" json:"track"`
	Order      int    `gorm:"index" json:"order"`
	Difficulty string `gorm:"type:varchar(20)" json:"difficulty"`
	AccessTier string `gorm:"type:varchar(20)" json:"access_tier"`
	TitleEN    string `json:"title_en"`
	TitlePL    string `json:"title_pl"`
	DescEN     string `json:"desc_en"`
	DescPL     string `json:"desc_pl"`

	Lessons []Lesson `gorm:"foreignKey:LessonGroupID;references:ID" json:"lessons,omitempty"`
}

func (lg *LessonGroup) BeforeCreate(tx *gorm.DB) (err error) {
	if lg.ID == "" {
		alphabet := "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
		lg.ID, err = gonanoid.Generate(alphabet, 12)
	}
	return
}

// ─────────────────────────────────────────────
// LESSON — sub-lekcja (teoria + zadanie)
// ─────────────────────────────────────────────

type Lesson struct {
	ID             string         `gorm:"primaryKey;type:varchar(12)" json:"id"`
	LessonGroupID  string         `gorm:"type:varchar(12);index" json:"lesson_group_id"`
	Order          int            `json:"order"`
	Track          string         `gorm:"type:varchar(20);index" json:"track"`
	Difficulty     string         `gorm:"type:varchar(20)" json:"difficulty"`
	Status         string         `gorm:"type:varchar(20)" json:"status"`
	LessonType     string         `gorm:"type:varchar(30)" json:"lesson_type"`
	TitleEN        string         `json:"title_en"`
	TitlePL        string         `json:"title_pl"`
	ContentEN      string         `json:"content_en"`
	ContentPL      string         `json:"content_pl"`
	PayloadEN      datatypes.JSON `json:"payload_en"`
	PayloadPL      datatypes.JSON `json:"payload_pl"`
}

func (l *Lesson) BeforeCreate(tx *gorm.DB) (err error) {
	if l.ID == "" {
		alphabet := "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
		l.ID, err = gonanoid.Generate(alphabet, 12)
	}
	return
}

// ─────────────────────────────────────────────
// LESSON PROGRESS — postęp na poziomie sub-lekcji
// ─────────────────────────────────────────────

type LessonProgress struct {
	ID        string    `gorm:"primaryKey;type:varchar(21)" json:"id"`
	UserID    string    `gorm:"type:varchar(50);index" json:"user_id"`
	LessonID  string    `gorm:"type:varchar(12);index" json:"lesson_id"`
	Completed bool      `json:"completed"`
	Score     int       `json:"score"`
	Attempts  int       `json:"attempts"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (lp *LessonProgress) BeforeCreate(tx *gorm.DB) (err error) {
	if lp.ID == "" {
		lp.ID, err = gonanoid.New()
	}
	return
}
