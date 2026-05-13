package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Auth0ID   string         `gorm:"uniqueIndex;not null" json:"auth0_id"`
	Email     string         `gorm:"uniqueIndex;not null" json:"email"`
	Name      string         `json:"name"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
