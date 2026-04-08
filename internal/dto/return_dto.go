// Package dto
package dto

import (
	"time"

	"github.com/lelecodedev/borrowly/pkg/types"
)

type (
	ReturnQuery struct {
		StartDate time.Time `form:"start_date" time_format:"2006-01-02"`
		EndDate   time.Time `form:"end_date"   time_format:"2006-01-02"`
		PaginationQuery
		SortQuery
	}

	ReturnResponse struct {
		ID           uint            `json:"id"`
		Borrow       *BorrowResponse `json:"borrow"`
		ReturnDate   time.Time       `json:"returnDate"`
		BorrowerNote *string         `json:"borrowerNote"`
		Fine         *float64        `json:"fine"`
		CreatedAt    time.Time       `json:"createdAt"`
		UpdatedAt    time.Time       `json:"updatedAt"`
	}

	ReturnRequest struct {
		BorrowerNote *string `json:"borrowerNote"`
	}

	ReturnCreateForUserRequest struct {
		BorrowID   uint            `json:"borrowId" binding:"required,gt=0"`
		ReturnDate *types.DateOnly `json:"returnDate" binding:"required" time_format:"2006-01-02"`
	}

	ReturnUpdateForUserRequest struct {
		ReturnDate *types.DateOnly `json:"returnDate" binding:"required" time_format:"2006-01-02"`
	}

	ReturnCardResponse struct {
		TotalReturn  int64 `json:"totalReturn"`
		TotalOverdue int64 `json:"totalOverdue"`
	}
)

func (rq *ReturnQuery) SetDefaults() {
	rq.PaginationQuery.SetDefaults()
	rq.SortQuery.SetDefaults(OrderDesc, OrderCreatedAt)
}
