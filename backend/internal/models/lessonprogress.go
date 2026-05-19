package models

import "time"

type LessonProgress struct {
	ID        uint `gorm:"primaryKey;type:varchar(12)"`
	UserID    uint `gorm:"user_id"`
	LessonID  uint `gorm:"lesson_id"`
	Completed bool `gorm:"completed"`
	Score     int  `gorm:"score"`
	Attempts  int  `gorm:"attempts"`
	UpdatedAt time.Time `gorm:"updated_at"`

}
