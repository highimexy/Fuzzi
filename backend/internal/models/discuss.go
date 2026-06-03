package models

import (
	"time"

	gonanoid "github.com/matoous/go-nanoid/v2"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type DiscussPost struct {
	ID           string         `gorm:"primaryKey;type:varchar(21)" json:"id"`
	UserID       string         `gorm:"type:varchar(100);index;not null" json:"user_id"`
	Title        string         `gorm:"type:varchar(200);not null" json:"title"`
	Body         string         `gorm:"type:text;not null" json:"body"`
	Tags         datatypes.JSON `json:"tags"`
	Category     string         `gorm:"type:varchar(30);index;not null;default:'general'" json:"category"`
	Upvotes      int            `gorm:"default:0" json:"upvotes"`
	Views        int            `gorm:"default:0" json:"views"`
	CommentCount int            `gorm:"default:0" json:"comment_count"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`

	Author User `gorm:"foreignKey:UserID;references:Auth0ID" json:"author"`
}

func (p *DiscussPost) BeforeCreate(tx *gorm.DB) (err error) {
	if p.ID == "" {
		p.ID, err = gonanoid.New()
	}
	return
}

type DiscussComment struct {
	ID        string         `gorm:"primaryKey;type:varchar(21)" json:"id"`
	PostID    string         `gorm:"type:varchar(21);index;not null" json:"post_id"`
	UserID    string         `gorm:"type:varchar(100);index;not null" json:"user_id"`
	Body      string         `gorm:"type:text;not null" json:"body"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	Author User `gorm:"foreignKey:UserID;references:Auth0ID" json:"author"`
}

func (c *DiscussComment) BeforeCreate(tx *gorm.DB) (err error) {
	if c.ID == "" {
		c.ID, err = gonanoid.New()
	}
	return
}

type DiscussVote struct {
	PostID    string    `gorm:"primaryKey;type:varchar(21)" json:"post_id"`
	UserID    string    `gorm:"primaryKey;type:varchar(100)" json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
}
