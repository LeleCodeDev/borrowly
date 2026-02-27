// Package service
package service

import (
	"context"

	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/mapper"
	"github.com/lelecodedev/borrowly/internal/model"
	"github.com/lelecodedev/borrowly/internal/repository"
)

type ReturnService struct {
	repo *repository.ReturnRepository
}

func NewReturnService(repo *repository.ReturnRepository) *ReturnService {
	return &ReturnService{
		repo: repo,
	}
}

func (s *ReturnService) GetAll(ctx context.Context, req dto.ReturnQuery) ([]dto.ReturnResponse, int64, error) {
	returns, total, err := s.repo.GetAll(ctx, req)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]dto.ReturnResponse, 0, len(returns))

	for _, returnBorrow := range returns {
		responses = append(responses, mapper.ToReturnResponse(&returnBorrow))
	}

	return responses, total, nil
}

func (s *ReturnService) UserGetAll(ctx context.Context, currentUser model.User, req dto.ReturnQuery) ([]dto.ReturnResponse, int64, error) {
	returns, total, err := s.repo.UserGetAll(ctx, currentUser.ID, req)
	if err != nil {
		return nil, 0, err
	}

	responses := make([]dto.ReturnResponse, 0, len(returns))

	for _, returnBorrow := range returns {
		responses = append(responses, mapper.ToReturnResponse(&returnBorrow))
	}

	return responses, total, nil
}
