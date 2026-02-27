// Package handler
package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
	"github.com/lelecodedev/borrowly/internal/service"
	"github.com/lelecodedev/borrowly/pkg/errors"
	"github.com/lelecodedev/borrowly/pkg/pagination"
	"github.com/lelecodedev/borrowly/pkg/response"
)

type BorrowHandler struct {
	Service *service.BorrowService
}

func NewBorrowHandler(service *service.BorrowService) *BorrowHandler {
	return &BorrowHandler{
		Service: service,
	}
}

func (h *BorrowHandler) GetAllBorrows(c *gin.Context) {
	var req dto.BorrowQuery

	if err := c.ShouldBindQuery(&req); err != nil {
		if valErrors, ok := errors.GetValidationError(err); ok {
			response.Error(c, http.StatusBadRequest, "Validation failed", valErrors)
			return
		}

		response.Error(c, http.StatusInternalServerError, "Server error", err)
		return
	}

	req.SetDefaults()
	ctx := c.Request.Context()

	borrows, total, err := h.Service.GetAll(ctx, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	pagination := pagination.BuildPagination(req.Page, req.Size, total)
	response.Paginated(c, http.StatusOK, "All borrows successfully fetched", borrows, pagination)
}

func (h *BorrowHandler) GetAllBorrowsByUser(c *gin.Context) {
	var req dto.BorrowQuery

	if err := c.ShouldBindQuery(&req); err != nil {
		if valErrors, ok := errors.GetValidationError(err); ok {
			response.Error(c, http.StatusBadRequest, "Validation failed", valErrors)
			return
		}

		response.Error(c, http.StatusInternalServerError, "Server error", err)
		return
	}

	req.SetDefaults()
	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	borrows, total, err := h.Service.UserGetAll(ctx, currentUser, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	pagination := pagination.BuildPagination(req.Page, req.Size, total)
	response.Paginated(c, http.StatusOK, "All borrows successfully fetched", borrows, pagination)
}

func (h *BorrowHandler) CreateBorrow(c *gin.Context) {
	var req dto.BorrowRequest

	if err := c.ShouldBind(&req); err != nil {
		if valErrors, ok := errors.GetValidationError(err); ok {
			response.Error(c, http.StatusBadRequest, "Validation failed", valErrors)
			return
		}

		response.Error(c, http.StatusInternalServerError, "Server error", nil)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	borrow, err := h.Service.Create(ctx, currentUser, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusCreated, "Borrow successfully created", borrow)
}

func (h *BorrowHandler) ApproveBorrow(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid ID", nil)
		return
	}

	var req dto.BorrowApprovalRequest
	if err := c.ShouldBind(&req); err != nil {
		if valErrors, ok := errors.GetValidationError(err); ok {
			response.Error(c, http.StatusBadRequest, "Validation failed", valErrors)
			return
		}

		response.Error(c, http.StatusInternalServerError, "Server error", nil)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	borrow, err := h.Service.Approve(ctx, currentUser, id, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Borrow successfully accepted", borrow)
}

func (h *BorrowHandler) RejectBorrow(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid ID", nil)
		return
	}

	var req dto.BorrowApprovalRequest
	if err := c.ShouldBind(&req); err != nil {
		if valErrors, ok := errors.GetValidationError(err); ok {
			response.Error(c, http.StatusBadRequest, "Validation failed", valErrors)
			return
		}

		response.Error(c, http.StatusInternalServerError, "Server error", nil)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	borrow, err := h.Service.Reject(ctx, currentUser, id, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Borrow successfully rejected", borrow)
}

func (h *BorrowHandler) ConfirmBorrow(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid ID", nil)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	borrow, err := h.Service.Confirm(ctx, currentUser, id)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Borrow successfully confirmed", borrow)
}

func (h *BorrowHandler) ReturnedBorrow(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid ID", nil)
		return
	}

	var req dto.ReturnRequest
	if err := c.ShouldBind(&req); err != nil {
		if valErrors, ok := errors.GetValidationError(err); ok {
			response.Error(c, http.StatusBadRequest, "Validation failed", valErrors)
			return
		}

		response.Error(c, http.StatusInternalServerError, "Server error", nil)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	borrow, err := h.Service.Return(ctx, currentUser, id, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Borrow successfully returned", borrow)
}
