// Package repository
package repository

import (
	"context"
	"errors"

	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
	"gorm.io/gorm"
)

type BorrowRepository struct {
	db *gorm.DB
}

func NewBorrowRepository(db *gorm.DB) *BorrowRepository {
	return &BorrowRepository{db: db}
}

func (r *BorrowRepository) WithTx(tx *gorm.DB) *BorrowRepository {
	return &BorrowRepository{db: tx}
}

func (r *BorrowRepository) GetAll(ctx context.Context, req dto.BorrowQuery) ([]model.Borrow, int64, error) {
	var borrows []model.Borrow
	var total int64

	db := r.db.WithContext(ctx).
		Preload("User").
		Preload("ReviewedUser").
		Preload("Item").
		Preload("Item.Category").
		Model(&model.Borrow{})

	if req.Status != "" {
		db = db.Where("status = ?", req.Status)
	}

	if !req.StartDate.IsZero() {
		db = db.Where("borrow_date >= ?", req.StartDate)
	}

	if !req.EndDate.IsZero() {
		db = db.Where("borrow_date <= ?", req.EndDate)
	}

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	db = db.Order(req.OrderBy + " " + req.Order)

	db = db.Offset(req.GetOffset()).Limit(req.Size)

	if err := db.Find(&borrows).Error; err != nil {
		return nil, 0, err
	}

	return borrows, total, nil
}

func (r *BorrowRepository) UserGetAll(ctx context.Context, userID uint, req dto.BorrowQuery) ([]model.Borrow, int64, error) {
	var borrows []model.Borrow
	var total int64

	db := r.db.WithContext(ctx).
		Preload("User").
		Preload("ReviewedUser").
		Preload("Item").
		Preload("Item.Category").
		Model(&model.Borrow{})

	db = db.Where("user_id = ?", userID)

	if req.Status != "" {
		db = db.Where("status = ?", req.Status)
	}

	if !req.StartDate.IsZero() {
		db = db.Where("borrow_date >= ?", req.StartDate)
	}

	if !req.EndDate.IsZero() {
		db = db.Where("borrow_date <= ?", req.EndDate)
	}

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	db = db.Order(req.OrderBy + " " + req.Order)

	db = db.Offset(req.GetOffset()).Limit(req.Size)

	if err := db.Find(&borrows).Error; err != nil {
		return nil, 0, err
	}

	return borrows, total, nil
}

func (r *BorrowRepository) GetByID(ctx context.Context, id int) (*model.Borrow, error) {
	var borrow model.Borrow

	if err := r.db.WithContext(ctx).
		Preload("User").
		Preload("ReviewedUser").
		Preload("Item").
		Preload("Item.Category").
		First(&borrow, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}

		return nil, err
	}

	return &borrow, nil
}

func (r *BorrowRepository) Create(ctx context.Context, borrow *model.Borrow) error {
	return r.db.WithContext(ctx).Create(borrow).Error
}

func (r *BorrowRepository) Update(ctx context.Context, borrow *model.Borrow) error {
	return r.db.WithContext(ctx).Save(borrow).Error
}
