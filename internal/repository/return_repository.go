// Package repository
package repository

import (
	"context"

	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
	"gorm.io/gorm"
)

type ReturnRepository struct {
	db *gorm.DB
}

func NewReturnRepository(db *gorm.DB) *ReturnRepository {
	return &ReturnRepository{
		db: db,
	}
}

func (r *ReturnRepository) WithTx(tx *gorm.DB) *ReturnRepository {
	return &ReturnRepository{db: tx}
}

func (r *ReturnRepository) Create(ctx context.Context, returnBorrow *model.Return) error {
	return r.db.WithContext(ctx).Create(returnBorrow).Error
}

func (r *ReturnRepository) GetAll(ctx context.Context, req dto.ReturnQuery) ([]model.Return, int64, error) {
	var returns []model.Return
	var total int64

	db := r.db.WithContext(ctx).
		Preload("Borrow").
		Preload("Borrow.User").
		Preload("Borrow.ReviewedUser").
		Preload("Borrow.Item").
		Preload("Borrow.Item.Category").
		Model(&model.Return{})

	if !req.StartDate.IsZero() {
		db = db.Where("return_date >= ?", req.StartDate)
	}

	if !req.EndDate.IsZero() {
		db = db.Where("return_date <= ?", req.EndDate)
	}

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	db = db.Order(string(req.OrderBy) + " " + string(req.Order))

	db = db.Offset(req.GetOffset()).Limit(req.Size)

	if err := db.Find(&returns).Error; err != nil {
		return nil, 0, err
	}

	return returns, total, nil
}

func (r *ReturnRepository) GetAllByUserID(ctx context.Context, userID uint, req dto.ReturnQuery) ([]model.Return, int64, error) {
	var returns []model.Return
	var total int64

	db := r.db.WithContext(ctx).
		Preload("Borrow").
		Preload("Borrow.User").
		Preload("Borrow.ReviewedUser").
		Preload("Borrow.Item").
		Preload("Borrow.Item.Category").
		Joins("JOIN borrows ON borrows.id = returns.borrow_id").
		Model(&model.Return{})

	db = db.Where("borrows.user_id = ?", userID)

	if !req.StartDate.IsZero() {
		db = db.Where("return_date >= ?", req.StartDate)
	}

	if !req.EndDate.IsZero() {
		db = db.Where("return_date <= ?", req.EndDate)
	}

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	db = db.Order(string(req.OrderBy) + " " + string(req.Order))

	db = db.Offset(req.GetOffset()).Limit(req.Size)

	if err := db.Find(&returns).Error; err != nil {
		return nil, 0, err
	}

	return returns, total, nil
}
