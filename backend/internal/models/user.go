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
	Bio       string         `gorm:"type:text;column:bio" json:"bio"`
	AvatarURL string         `gorm:"column:avatar_url" json:"avatar_url"`
	Location  string         `gorm:"column:location" json:"location"`
	Website   string         `gorm:"column:website" json:"website"`
	Twitter   string         `gorm:"column:twitter" json:"twitter"`
	LinkedIn  string         `gorm:"column:linkedin" json:"linkedin"`
	GitHub    string         `gorm:"column:github" json:"github"`
	Role      string         `gorm:"type:varchar(20);default:'user'" json:"role"`
	Karma     int            `gorm:"default:0;column:karma" json:"karma"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
