// Package dto
package dto

type SortQuery struct {
	Order   string `form:"order" json:"order" binding:"omitempty,oneof=asc desc"`
	OrderBy string `form:"orderBy" json:"orderBy" binding:"omitempty,oneof=created_at updated_at"`
}

func (sq *SortQuery) SetDefaults() {
	if sq.Order == "" {
		sq.Order = "desc"
	}

	if sq.OrderBy == "" {
		sq.OrderBy = "updated_at"
	}
}
