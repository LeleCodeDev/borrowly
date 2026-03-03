// Package dto
package dto

import (
	"time"

	"github.com/lelecodedev/borrowly/internal/model"
)

type (
	LogQuery struct {
		PaginationQuery
		SortQuery
	}

	LogResponse struct {
		ID        uint               `json:"id"`
		User      *UserResponse      `json:"user"`
		Activity  model.ActivityType `gorm:"not null"`
		CreatedAt time.Time          `json:"createdAt"`
	}
)

func (lq *LogQuery) SetDefaults() {
	lq.PaginationQuery.SetDefaults()
	lq.SortQuery.SetDefaults(OrderDesc, OrderCreatedAt)
	lq.OrderBy = "created_at"
}
