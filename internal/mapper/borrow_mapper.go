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

	correctStatus := (borrow.Status == model.BorrowStatusBorrowed || borrow.Status == model.BorrowStatusReturned)

	return dto.BorrowResponse{
		ID:           borrow.ID,
		User:         ToUserResponse(&borrow.User),
		ReviewedUser: reviewUser,
		Item:         ToItemResponse(&borrow.Item),
		Purpose:      borrow.Purpose,
		Quantity:     borrow.Quantity,
		OfficerNote:  borrow.OfficerNote,
		BorrowDate:   borrow.BorrowDate,
		ReturnDate:   borrow.ReturnDate,
		Status:       borrow.Status,
		ReviewAt:     borrow.ReviewAt,
		IsOverdue:    correctStatus && time.Now().After(borrow.ReturnDate),
		CreatedAt:    borrow.CreatedAt,
		UpdatedAt:    borrow.UpdatedAt,
	}
}

func ToBorrowModel(req dto.BorrowRequest, user model.User, item model.Item) *model.Borrow {
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
