// Package handler
package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lelecodedev/borrowly/internal/dto"
	"github.com/lelecodedev/borrowly/internal/model"
	"github.com/lelecodedev/borrowly/internal/service"
	"github.com/lelecodedev/borrowly/internal/util"
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
		response.HandleValidationError(c, err)
		return
	}

	req.SetDefaults()
	ctx := c.Request.Context()

	categories, total, err := h.service.GetAll(ctx, req)
	if err != nil {
		response.HandleServiceError(c, err)
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
	id, err := util.GetParamID(c)
	if err != nil {
		response.HandleServiceError(c, err)
		return
	}

	ctx := c.Request.Context()

	category, err := h.service.GetByID(ctx, id)
	if err != nil {
		response.HandleServiceError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Category successfully fetched", category)
}

func (h *CategoryHandler) CreateCategory(c *gin.Context) {
	var req dto.CategoryRequest

	if err := c.ShouldBind(&req); err != nil {

		response.HandleValidationError(c, err)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	category, err := h.service.Create(ctx, currentUser, req)
	if err != nil {
		response.HandleServiceError(c, err)
		return
	}

	response.Success(c, http.StatusCreated, "Category successfully created", category)
}

func (h *CategoryHandler) UpdateCategory(c *gin.Context) {
	id, err := util.GetParamID(c)
	if err != nil {
		response.HandleServiceError(c, err)
		return
	}

	var req dto.CategoryRequest
	if err := c.ShouldBind(&req); err != nil {
		response.HandleValidationError(c, err)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	category, err := h.service.Update(ctx, id, currentUser, req)
	if err != nil {
		response.HandleServiceError(c, err)
		return
	}

	response.Success(c, http.StatusOK, "Category successfully updated", category)
}

func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
	id, err := util.GetParamID(c)
	if err != nil {
		response.HandleServiceError(c, err)
		return
	}

	ctx := c.Request.Context()
	currentUser := c.MustGet("user").(model.User)

	if err := h.service.Delete(ctx, currentUser, id); err != nil {
		response.HandleServiceError(c, err)
		return
	}

	response.Success[any](c, http.StatusOK, "Category successfully deleted", nil)
}
