// Package model
package model

import (
	"time"

	"gorm.io/gorm"
)

type UserRole string

const (
	RoleAdmin    UserRole = "admin"
	RoleOfficer  UserRole = "officer"
	RoleBorrower UserRole = "borrower"
)

type User struct {
	ID        uint     `gorm:"primaryKey"`
	Username  string   `gorm:"not null;index"`
	Email     string   `gorm:"not null;uniqueIndex:idx_email_deleted_at;index"`
	Password  string   `gorm:"not null"`
	Phone     string   `gorm:"not null"`
	Role      UserRole `gorm:"type:enum('admin', 'officer', 'borrower');default:borrower;not null"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index;uniqueIndex:idx_email_deleted_at"`
}
