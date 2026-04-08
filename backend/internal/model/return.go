// Package model
package model

import (
	"time"

	"gorm.io/gorm"
)

type Return struct {
	ID           uint           `json:"id" gorm:"primaryKey"`
	BorrowID     uint           `json:"borrowId" gorm:"not null;index"`
	Borrow       Borrow         `json:"borrow" gorm:"constraint:OnDelete:CASCADE"`
	ReturnDate   time.Time      `json:"returnDate" gorm:"type:date"`
	BorrowerNote *string        `json:"borrowerNote" gorm:"type:text"`
	Fine         *float64       `json:"fine" gorm:"type:decimal(10, 2)"`
	CreatedAt    time.Time      `json:"createdAt"`
	UpdatedAt    time.Time      `json:"updatedAt"`
	DeletedAt    gorm.DeletedAt `json:"deletedAt" gorm:"index"`
}
