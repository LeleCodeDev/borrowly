// Package mapper
package mapper

import (
	"time"

	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
)

func ToReturnResponse(returnBorrow *model.Return) dto.ReturnResponse {
	var borrow *dto.BorrowResponse
	if returnBorrow.Borrow.ID != 0 {
		borrowResponse := ToBorrowResponse(&returnBorrow.Borrow)
		borrow = &borrowResponse
	}

	return dto.ReturnResponse{
		ID:           returnBorrow.ID,
		Borrow:       borrow,
		ReturnDate:   returnBorrow.ReturnDate,
		BorrowerNote: returnBorrow.BorrowerNote,
		Fine:         returnBorrow.Fine,
		CreatedAt:    returnBorrow.CreatedAt,
		UpdatedAt:    returnBorrow.UpdatedAt,
	}
}

func ToReturnModel(
	borrow *model.Borrow,
	returnDate time.Time,
	req dto.ReturnRequest,
	fine *float64,
) *model.Return {
	return &model.Return{
		BorrowID:     borrow.ID,
		Borrow:       *borrow,
		ReturnDate:   returnDate,
		BorrowerNote: req.BorrowerNote,
		Fine:         fine,
	}
}

func ToReturnModelForUser(
	borrow *model.Borrow,
	returnDate time.Time,
	req dto.ReturnCreateForUserRequest,
	fine *float64,
) *model.Return {
	return &model.Return{
		BorrowID:   borrow.ID,
		Borrow:     *borrow,
		ReturnDate: returnDate,
		Fine:       fine,
	}
}
