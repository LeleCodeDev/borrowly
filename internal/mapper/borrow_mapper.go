// Package mapper
package mapper

import (
	"time"

	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
)

func ToBorrowResponse(borrow *model.Borrow) dto.BorrowResponse {
	var reviewUser *dto.UserResponse
	if borrow.ReviewedUser != nil {
		userResponse := ToUserResponse(borrow.ReviewedUser)
		reviewUser = &userResponse
	}

	var user *dto.UserResponse
	if borrow.User.ID != 0 {
		userResponse := ToUserResponse(&borrow.User)
		user = &userResponse
	}

	var item *dto.ItemResponse
	if borrow.Item.ID != 0 {
		itemResponse := ToItemResponse(&borrow.Item)
		item = &itemResponse
	}

	return dto.BorrowResponse{
		ID:           borrow.ID,
		User:         user,
		ReviewedUser: reviewUser,
		Item:         item,
		Purpose:      borrow.Purpose,
		Quantity:     borrow.Quantity,
		OfficerNote:  borrow.OfficerNote,
		BorrowDate:   borrow.BorrowDate,
		ReturnDate:   borrow.ReturnDate,
		Status:       borrow.Status,
		ReviewAt:     borrow.ReviewAt,
		IsOverdue:    borrow.Status == model.BorrowStatusBorrowed && time.Now().After(borrow.ReturnDate),
		CreatedAt:    borrow.CreatedAt,
		UpdatedAt:    borrow.UpdatedAt,
	}
}

func ToBorrowModel(req dto.BorrowCreateRequest, user model.User, item model.Item) *model.Borrow {
	return &model.Borrow{
		UserID:     user.ID,
		User:       user,
		ItemID:     item.ID,
		Item:       item,
		Purpose:    req.Purpose,
		Quantity:   req.Quantity,
		BorrowDate: req.BorrowDate.Time,
		ReturnDate: req.ReturnDate.Time,
		Status:     model.BorrowStatusPending,
	}
}
