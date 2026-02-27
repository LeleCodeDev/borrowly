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
	ID        uint           `json:"id" gorm:"primaryKey"`
	Username  string         `json:"username" gorm:"not null;index"`
	Email     string         `json:"email" gorm:"not null;unique"`
	Password  string         `json:"password" gorm:"not null"`
	Phone     string         `json:"phone" gorm:"not null"`
	Role      UserRole       `json:"role" gorm:"type:enum('admin', 'officer', 'borrower');default:borrower;not null"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" gorm:"index"`
}
