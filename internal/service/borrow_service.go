// Package service
package service

import (
	"context"
	"fmt"
	"time"

	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/mapper"
	"github.com/lelecodedev/borrowly/internal/model"
	"github.com/lelecodedev/borrowly/internal/repository"
	"github.com/lelecodedev/borrowly/pkg/errors"
	"gorm.io/gorm"
)

type BorrowService struct {
	txManager  *repository.TxManager
	repo       *repository.BorrowRepository
	itemRepo   *repository.ItemRepository
	logRepo    *repository.LogActivityRepository
	returnRepo *repository.ReturnRepository
}

func NewBorrowService(
	txManager *repository.TxManager,
	repo *repository.BorrowRepository,
	itemRepo *repository.ItemRepository,
	logRepo *repository.LogActivityRepository,
) *BorrowService {
	return &BorrowService{
		txManager: txManager,
		repo:      repo,
		itemRepo:  itemRepo,
		logRepo:   logRepo,
	}
}

func (s *BorrowService) GetAll(ctx context.Context, req dto.BorrowQuery) ([]dto.BorrowResponse, int64, error) {
	borrows, total, err := s.repo.GetAll(ctx, req)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]dto.BorrowResponse, 0, len(borrows))

	for _, borrow := range borrows {
		responses = append(responses, mapper.ToBorrowResponse(&borrow))
	}

	return responses, total, nil
}

func (s *BorrowService) UserGetAll(ctx context.Context, currentUser model.User, req dto.BorrowQuery) ([]dto.BorrowResponse, int64, error) {
	borrows, total, err := s.repo.GetAllByUserID(ctx, currentUser.ID, req)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]dto.BorrowResponse, 0, len(borrows))

	for _, borrow := range borrows {
		responses = append(responses, mapper.ToBorrowResponse(&borrow))
	}

	return responses, total, nil
}

func (s *BorrowService) GetDashboardData(ctx context.Context) (dto.BorrowDashboardResponse, error) {
	totalPending, err := s.repo.CountByStatus(ctx, model.BorrowStatusPending)
	if err != nil {
		return dto.BorrowDashboardResponse{}, err
	}

	totalApproved, err := s.repo.CountByStatus(ctx, model.BorrowStatusApproved)
	if err != nil {
		return dto.BorrowDashboardResponse{}, err
	}

	totalRejected, err := s.repo.CountByStatus(ctx, model.BorrowStatusRejected)
	if err != nil {
		return dto.BorrowDashboardResponse{}, err
	}

	return dto.BorrowDashboardResponse{
		TotalPending:  totalPending,
		TotalApproved: totalApproved,
		TotalRejected: totalRejected,
	}, nil
}

func (s *BorrowService) GetUserDashboardData(ctx context.Context, currentUser model.User) (dto.BorrowDashboardResponse, error) {
	totalPending, err := s.repo.CountByStatusAndUserID(ctx, model.BorrowStatusPending, currentUser.ID)
	if err != nil {
		return dto.BorrowDashboardResponse{}, err
	}

	totalApproved, err := s.repo.CountByStatusAndUserID(ctx, model.BorrowStatusApproved, currentUser.ID)
	if err != nil {
		return dto.BorrowDashboardResponse{}, err
	}

	totalRejected, err := s.repo.CountByStatusAndUserID(ctx, model.BorrowStatusRejected, currentUser.ID)
	if err != nil {
		return dto.BorrowDashboardResponse{}, err
	}

	return dto.BorrowDashboardResponse{
		TotalPending:  totalPending,
		TotalApproved: totalApproved,
		TotalRejected: totalRejected,
	}, nil
}

func (s *BorrowService) Create(ctx context.Context, currentUser model.User, req dto.BorrowRequest) (dto.BorrowResponse, error) {
	var createdBorrow *model.Borrow

	now := time.Now().Truncate(24 * time.Hour)
	if req.BorrowDate.Before(now) {
		return dto.BorrowResponse{}, errors.BadRequest("Borrow date cannot be in the past")
	}
	if !req.ReturnDate.After(req.BorrowDate.Time) {
		return dto.BorrowResponse{}, errors.BadRequest("Return date must be after borrow date")
	}

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txBorrowRepo := s.repo.WithTx(tx)
		txItemRepo := s.itemRepo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		item, err := txItemRepo.GetByID(ctx, int(req.ItemID))
		if err != nil {
			return err
		}
		if item == nil {
			return errors.NotFound(fmt.Sprintf("Item not found with ID: %d", req.ItemID))
		}

		borrow := mapper.ToBorrowModel(req, currentUser, *item)
		if err := txBorrowRepo.Create(ctx, borrow); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, model.ActivityCreateBorrow)
		if err := txLogRepo.Create(ctx, log); err != nil {
			return err
		}

		createdBorrow = borrow

		return nil
	}); err != nil {
		return dto.BorrowResponse{}, err
	}

	return mapper.ToBorrowResponse(createdBorrow), nil
}

func (s *BorrowService) Approve(ctx context.Context, currentUser model.User, id int, req dto.BorrowApprovalRequest) (dto.BorrowResponse, error) {
	var approvedBorrow *model.Borrow

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txBorrowRepo := s.repo.WithTx(tx)
		txItemRepo := s.itemRepo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		borrow, err := txBorrowRepo.GetByID(ctx, id)
		if err != nil {
			return err
		}
		if borrow == nil {
			return errors.NotFound(fmt.Sprintf("Borrow not found with ID: %d", id))
		}
		if borrow.Status != model.BorrowStatusPending {
			return errors.BadRequest("Borrow status is not pending")
		}

		item := &borrow.Item
		if item.Quantity < borrow.Quantity {
			return errors.BadRequest("Item does not have enough quantity")
		}

		now := time.Now()
		borrow.Status = model.BorrowStatusApproved
		borrow.ReviewedUserID = &currentUser.ID
		borrow.ReviewedUser = &currentUser
		borrow.OfficerNote = req.OfficerNote
		borrow.ReviewAt = &now

		item.Quantity -= borrow.Quantity
		if item.Quantity <= 0 {
			item.Status = model.ItemStatusUnavailable
		} else {
			item.Status = model.ItemStatusAvailable
		}

		if err := txItemRepo.Update(ctx, item); err != nil {
			return err
		}

		if err := txBorrowRepo.Update(ctx, borrow); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, model.ActivityApproveBorrow)
		if err := txLogRepo.Create(ctx, log); err != nil {
			return err
		}

		approvedBorrow = borrow

		return nil
	}); err != nil {
		return dto.BorrowResponse{}, err
	}

	return mapper.ToBorrowResponse(approvedBorrow), nil
}

func (s *BorrowService) Reject(ctx context.Context, currentUser model.User, id int, req dto.BorrowApprovalRequest) (dto.BorrowResponse, error) {
	var rejectedBorrow *model.Borrow

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txBorrowRepo := s.repo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		borrow, err := txBorrowRepo.GetByID(ctx, id)
		if err != nil {
			return err
		}
		if borrow == nil {
			return errors.NotFound(fmt.Sprintf("Borrow not found with ID: %d", id))
		}

		if borrow.Status != model.BorrowStatusPending {
			return errors.BadRequest("Borrow status is not pending")
		}

		now := time.Now()
		borrow.Status = model.BorrowStatusRejected
		borrow.ReviewedUserID = &currentUser.ID
		borrow.ReviewedUser = &currentUser
		borrow.OfficerNote = req.OfficerNote
		borrow.ReviewAt = &now

		if err := txBorrowRepo.Update(ctx, borrow); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, model.ActivityRejectBorrow)
		if err := txLogRepo.Create(ctx, log); err != nil {
			return err
		}

		rejectedBorrow = borrow

		return nil
	}); err != nil {
		return dto.BorrowResponse{}, err
	}

	return mapper.ToBorrowResponse(rejectedBorrow), nil
}

func (s *BorrowService) Confirm(ctx context.Context, currentUser model.User, id int) (dto.BorrowResponse, error) {
	var borrowedBorrow *model.Borrow

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txBorrowRepo := s.repo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)

		borrow, err := txBorrowRepo.GetByID(ctx, id)
		if err != nil {
			return err
		}
		if borrow == nil {
			return errors.NotFound(fmt.Sprintf("Borrow not found with ID: %d", id))
		}

		if borrow.Status != model.BorrowStatusApproved {
			return errors.BadRequest("Borrow status is not approved")
		}
		borrow.Status = model.BorrowStatusBorrowed

		if err := txBorrowRepo.Update(ctx, borrow); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, model.ActivityBorrowedBorrow)
		if err := txLogRepo.Create(ctx, log); err != nil {
			return err
		}

		borrowedBorrow = borrow

		return nil
	}); err != nil {
		return dto.BorrowResponse{}, err
	}

	return mapper.ToBorrowResponse(borrowedBorrow), nil
}

func (s *BorrowService) Return(ctx context.Context, currentUser model.User, id int, req dto.ReturnRequest) (dto.BorrowResponse, error) {
	var returnedBorrow *model.Borrow

	if err := s.txManager.Transaction(ctx, func(tx *gorm.DB) error {
		txBorrowRepo := s.repo.WithTx(tx)
		txLogRepo := s.logRepo.WithTx(tx)
		txReturnRepo := s.returnRepo.WithTx(tx)

		borrow, err := txBorrowRepo.GetByID(ctx, id)
		if err != nil {
			return err
		}
		if borrow == nil {
			return errors.NotFound(fmt.Sprintf("Borrow not found with ID: %d", id))
		}

		if borrow.Status != model.BorrowStatusBorrowed {
			return errors.BadRequest("Item is not being borrowed")
		}

		borrow.Status = model.BorrowStatusReturned
		if err := txBorrowRepo.Update(ctx, borrow); err != nil {
			return err
		}

		var fine *float64
		now := time.Now().Truncate(24 * time.Hour)
		if now.After(borrow.ReturnDate) {
			diff := now.Sub(borrow.ReturnDate)
			diffOfDays := int(diff / (24 * time.Hour))
			fineAmount := float64(2000 * diffOfDays)
			fine = &fineAmount
		}

		returnBorrow := mapper.ToReturnModel(borrow, now, req, fine)
		if err := txReturnRepo.Create(ctx, returnBorrow); err != nil {
			return err
		}

		log := mapper.ToLogActivityModel(currentUser, model.ActivityReturnBorrow)
		if err := txLogRepo.Create(ctx, log); err != nil {
			return err
		}

		returnedBorrow = borrow

		return nil
	}); err != nil {
		return dto.BorrowResponse{}, err
	}

	return mapper.ToBorrowResponse(returnedBorrow), nil
}
