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

type CategoryHandler struct {
	service *service.CategoryService
}

func NewCategoryHandler(service *service.CategoryService) *CategoryHandler {
	return &CategoryHandler{
		service: service,
	}
}

func (h *CategoryHandler) GetAllCategories(c *gin.Context) {
	var req dto.CategoryQuery

	if err := c.ShouldBindQuery(&req); err != nil {
		if valErrors, ok := errors.GetValidationError(err); ok {
			response.Error(c, http.StatusBadRequest, "Validation failed", valErrors)
			return
		}
		response.Error(c, http.StatusInternalServerError, "Server error", nil)
		return
	}

	req.SetDefaults()
	ctx := c.Request.Context()

	categories, total, err := h.service.GetAll(ctx, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	if req.Unpage {
		response.Success(c, http.StatusOK, "All categories successfully fetched", categories)
		return
	}

	pagination := pagination.BuildPagination(req.Page, req.Size, total)

	response.Paginated(c, http.StatusOK, "All categories successfully fetched", categories, pagination)
}

func (h *CategoryHandler) GetCategoryByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid ID", nil)
		return
	}

	ctx := c.Request.Context()

	category, err := h.service.GetByID(ctx, id)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Category successfully fetched", category)
}

func (h *CategoryHandler) CreateCategory(c *gin.Context) {
	var req dto.CategoryRequest

	if err := c.ShouldBind(&req); err != nil {
		if valError, ok := errors.GetValidationError(err); ok {
			response.Error(c, http.StatusBadRequest, "Validation failed", valError)
			return
		}

		response.Error(c, http.StatusInternalServerError, "Server error", nil)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	category, err := h.service.Create(ctx, currentUser, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusCreated, "Category successfully created", category)
}

func (h *CategoryHandler) UpdateCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid ID", nil)
		return
	}

	var req dto.CategoryRequest
	if err := c.ShouldBind(&req); err != nil {
		if valError, ok := errors.GetValidationError(err); ok {
			response.Error(c, http.StatusBadRequest, "Validation failed", valError)
			return
		}

		response.Error(c, http.StatusInternalServerError, "Server error", nil)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	category, err := h.service.Update(ctx, id, currentUser, req)
	if err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Category successfully updated", category)
}

func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid ID", nil)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	if err := h.service.Delete(ctx, currentUser, id); err != nil {
		response.HandleError(c, err)
		return
	}

	response.Success[any](c, http.StatusOK, "Category successfully deleted", nil)
}
