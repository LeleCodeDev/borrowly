// Package handler
package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
	"github.com/lelecodedev/borrowly/internal/service"
	"github.com/lelecodedev/borrowly/pkg/errors"
	"github.com/lelecodedev/borrowly/pkg/pagination"
	"github.com/lelecodedev/borrowly/pkg/response"
)

type ReturnHandler struct {
	service *service.ReturnService
}

func NewReturnHandler(service *service.ReturnService) *ReturnHandler {
	return &ReturnHandler{
		service: service,
	}
}

func (h *ReturnHandler) GetAllReturns(c *gin.Context) {
	var req dto.ReturnQuery

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

	returns, total, err := h.service.GetAll(ctx, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	pagination := pagination.BuildPagination(req.Page, req.Size, total)
	response.Paginated(c, http.StatusOK, "All returns successfully fetched", returns, pagination)
}

func (h *ReturnHandler) GetAllReturnsByUser(c *gin.Context) {
	var req dto.ReturnQuery

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

	returns, total, err := h.service.GetAllByUser(ctx, currentUser, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	pagination := pagination.BuildPagination(req.Page, req.Size, total)
	response.Paginated(c, http.StatusOK, "All returns successfully fetched", returns, pagination)
}

func (h *ReturnHandler) GetReturnCard(c *gin.Context) {
	ctx := c.Request.Context()

	dashboardData, err := h.service.GetCardData(ctx)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Return dashboard data successfully fetched", dashboardData)
}

func (h *ReturnHandler) GetReturnCardByUser(c *gin.Context) {
	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	cardData, err := h.service.GetCardDataByUser(ctx, currentUser)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Return dashboard data successfully fetched", cardData)
}
