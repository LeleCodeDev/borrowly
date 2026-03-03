// Package dto
package dto

import "time"

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
)

func (rq *ReturnQuery) SetDefaults() {
	rq.PaginationQuery.SetDefaults()
	rq.SortQuery.SetDefaults(OrderCreatedAt)
}
