// Package model
package model

import (
	"time"
)

type ActivityType string

const (
	ActivityCreateUser ActivityType = "CREATE_USER"
	ActivityUpdateUser ActivityType = "UPDATE_USER"
	ActivityDeleteUser ActivityType = "DELETE_USER"

	ActivityCreateCategory ActivityType = "CREATE_CATEGORY"
	ActivityUpdateCategory ActivityType = "UPDATE_CATEGORY"
	ActivityDeleteCategory ActivityType = "DELETE_CATEGORY"

	ActivityCreateItem ActivityType = "CREATE_ITEM"
	ActivityUpdateItem ActivityType = "UPDATE_ITEM"
	ActivityDeleteItem ActivityType = "DELETE_ITEM"

	ActivityCreateBorrow   ActivityType = "CREATE_BORROW"
	ActivityUpdateBorrow   ActivityType = "UPDATE_BORROW"
	ActivityApproveBorrow  ActivityType = "APPROVE_BORROW"
	ActivityRejectBorrow   ActivityType = "REJECT_BORROW"
	ActivityBorrowedBorrow ActivityType = "BORROWED_BORROW"
	ActivityReturnBorrow   ActivityType = "RETURN_BORROW"
	ActivityDeleteBorrow   ActivityType = "DELETE_BORROW"
	ActivityCanceledBorrow ActivityType = "DELETE_BORROW"

	ActivityReturnItem    ActivityType = "RETURN_ITEM"
	ActivityConfirmReturn ActivityType = "CONFIRM_RETURN"

	ActivityCreateReturn ActivityType = "CREATE_RETURN"
	ActivityUpdateReturn ActivityType = "UPDATE_RETURN"
	ActivityDeleteReturn ActivityType = "DELETE_RETURN"
)

type LogActivity struct {
	ID        uint         `json:"id" gorm:"primaryKey"`
	UserID    *uint        `json:"userId" gorm:"index"`
	User      *User        `json:"user" gorm:"constraint:OnDelete:SET NULL"`
	Activity  ActivityType `gorm:"not null"`
	CreatedAt time.Time    `json:"createdAt"`
}
