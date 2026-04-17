// Package model
package model

import (
	"time"

	"gorm.io/gorm"
)

type BorrowStatus string

const (
	BorrowStatusPending  BorrowStatus = "pending"
	BorrowStatusRejected BorrowStatus = "rejected"
	BorrowStatusApproved BorrowStatus = "approved"
	BorrowStatusBorrowed BorrowStatus = "borrowed"
	BorrowStatusReturned BorrowStatus = "returned"
	BorrowStatusCanceled BorrowStatus = "canceled"
)

type Borrow struct {
	ID             uint           `json:"id" gorm:"primaryKey;autoIncrement:true"`
	UserID         uint           `json:"userId" gorm:"not null;index"`
	User           User           `json:"user" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	ReviewedUserID *uint          `json:"reviewedUserID" gorm:"index"`
	ReviewedUser   *User          `json:"reviewedUser" gorm:"foreignKey:ReviewedUserID;constraint:OnDelete:SET NULL"`
	ItemID         uint           `json:"itemId" gorm:"not null;index"`
	Item           Item           `json:"item" gorm:"constraint:OnDelete:CASCADE"`
	Purpose        string         `json:"purpose" gorm:"not null"`
	Quantity       int            `json:"quantity" gorm:"not null"`
	OfficerNote    *string        `json:"officerNote" gorm:"type:text"`
	BorrowDate     time.Time      `json:"borrowDate" gorm:"not null;type:date"`
	ReturnDate     time.Time      `json:"returnDate" gorm:"type:date"`
	Status         BorrowStatus   `json:"status" gorm:"type:enum('pending', 'rejected', 'approved', 'borrowed', 'returned', 'canceled');default:pending;not null"`
	ReviewAt       *time.Time     `json:"reviewAt" gorm:"type:date"`
	CreatedAt      time.Time      `json:"createdAt"`
	UpdatedAt      time.Time      `json:"updatedAt"`
	DeletedAt      gorm.DeletedAt `json:"deletedAt" gorm:"index"`
}
