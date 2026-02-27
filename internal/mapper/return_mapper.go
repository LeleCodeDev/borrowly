// Package mapper
package mapper

import (
	"time"

	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
)

func ToReturnResponse(returnBorrow *model.Return) dto.ReturnResponse {
	return dto.ReturnResponse{
		ID:           returnBorrow.ID,
		Borrow:       ToBorrowResponse(&returnBorrow.Borrow),
		ReturnDate:   returnBorrow.Borrow.ReturnDate,
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
