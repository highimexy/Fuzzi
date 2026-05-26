package models

import (
	"time"

	"gorm.io/datatypes"
)

type Quest struct {
	ID         string         `gorm:"primaryKey;type:varchar(40)" json:"id"`
	Type       string         `gorm:"type:varchar(20);not null" json:"type"`
	Track      string         `gorm:"type:varchar(20);not null" json:"track"`
	Difficulty string         `gorm:"type:varchar(20)" json:"difficulty"`
	TitleEN    string         `json:"title_en"`
	TitlePL    string         `json:"title_pl"`
	BodyEN     string         `json:"body_en"`
	BodyPL     string         `json:"body_pl"`
	Options    datatypes.JSON `json:"options"`
	CorrectKey string         `gorm:"type:varchar(10)" json:"correct_key"`
	ExplainEN  string         `json:"explain_en"`
	ExplainPL  string         `json:"explain_pl"`
	XP         int            `gorm:"default:10" json:"xp"`
	ActiveDate string         `gorm:"type:varchar(10);index" json:"active_date"`
	CreatedAt  time.Time      `json:"created_at"`
}

type QuestAttempt struct {
	ID          string    `gorm:"primaryKey;type:varchar(40)" json:"id"`
	UserID      string    `gorm:"type:varchar(100);index" json:"user_id"`
	QuestID     string    `gorm:"type:varchar(40);index" json:"quest_id"`
	AnswerKey   string    `gorm:"type:varchar(10)" json:"answer_key"`
	IsCorrect   bool      `json:"is_correct"`
	XPEarned    int       `json:"xp_earned"`
	AttemptedAt time.Time `json:"attempted_at"`
}

type UserQuestStats struct {
	UserID         string    `gorm:"primaryKey;type:varchar(100)" json:"user_id"`
	TotalXP        int       `gorm:"default:0" json:"total_xp"`
	CurrentStreak  int       `gorm:"default:0" json:"current_streak"`
	LongestStreak  int       `gorm:"default:0" json:"longest_streak"`
	LastActiveDate string    `gorm:"type:varchar(10)" json:"last_active_date"`
	TotalCorrect   int       `gorm:"default:0" json:"total_correct"`
	TotalAttempts  int       `gorm:"default:0" json:"total_attempts"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type QuestOption struct {
	Key    string `json:"key"`
	TextEN string `json:"text_en"`
	TextPL string `json:"text_pl"`
}
