package models

import "time"

type AdminAuditLog struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	AdminID   string    `gorm:"type:varchar(100);index;not null" json:"admin_id"`
	Action    string    `gorm:"type:varchar(50);not null" json:"action"`
	Target    string    `gorm:"type:varchar(200)" json:"target"`
	CreatedAt time.Time `json:"created_at"`
}
