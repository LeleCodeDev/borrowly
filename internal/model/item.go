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
	ID          uint           `json:"id" gorm:"primaryKey"`
	Name        string         `json:"name" gorm:"not null;index;type:varchar(255);uniqueIndex:idx_name_deleted_at"`
	Description string         `json:"description" gorm:"type:text"`
	CategoryID  uint           `json:"categoryId" gorm:"not null"`
	Category    Category       `json:"category" gorm:"constraint:OnDelete:CASCADE"`
	Quantity    int            `json:"quantity" gorm:"not null"`
	Image       *string        `json:"image" gorm:"type:varchar(255)"`
	Status      ItemStatus     `json:"status" gorm:"type:enum('available', 'unavailable');default:unavailable;not null"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `json:"deletedAt" gorm:"index;uniqueIndex:idx_name_deleted_at"`
}
