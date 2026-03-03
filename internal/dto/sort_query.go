// Package dto
package dto

type OrderByValue string

const (
	OrderCreatedAt OrderByValue = "created_at"
	OrderUpdatedAt OrderByValue = "updated_at"
)

type SortQuery struct {
	Order   string       `form:"order" json:"order" binding:"omitempty,oneof=asc desc"`
	OrderBy OrderByValue `form:"orderBy" json:"orderBy" binding:"omitempty,oneof=created_at updated_at"`
}

func (sq *SortQuery) SetDefaults(orderBy OrderByValue) {
	if sq.Order == "" {
		sq.Order = "desc"
	}

	if sq.OrderBy == "" {
		sq.OrderBy = orderBy
	}
}
