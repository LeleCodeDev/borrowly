// Package model
package model

import (
	"time"

	"gorm.io/gorm"
)

type ItemStatus string

const (
	ItemStatusUnavailable ItemStatus = "unavailable"
	ItemStatusAvailable   ItemStatus = "available"
)

type Item struct {
	ID          uint       `gorm:"primaryKey"`
	Name        string     `gorm:"not null;index;type:varchar(255);uniqueIndex:idx_name_deleted_at"`
	Description string     `gorm:"type:text"`
	CategoryID  uint       `gorm:"not null;index"`
	Category    Category   `gorm:"constraint:OnDelete:CASCADE"`
	Quantity    int        `gorm:"not null"`
	Image       *string    `gorm:"type:varchar(255)"`
	Status      ItemStatus `gorm:"type:enum('available', 'unavailable');default:unavailable;not null"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   gorm.DeletedAt `gorm:"index;uniqueIndex:idx_name_deleted_at"`
}
