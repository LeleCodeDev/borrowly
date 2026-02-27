package bootstrap

import (
	"github.com/lelecodedev/borrowly/internal/middleware"
	"github.com/lelecodedev/borrowly/internal/model"
)

func (a *App) RegisterRoute() {
	a.Router.Static("/uploads", "uploads")

	api := a.Router.Group("/api")

	auth := api.Group("/auth")
	{
		auth.POST("/register", a.AuthHandler.Register)
		auth.POST("/login", a.AuthHandler.Login)
	}

	authenticated := api.Group("")
	authenticated.Use(a.AuthMiddleware)

	allRoles := authenticated.Group("")
	allRoles.Use(middleware.RoleMiddleware(model.RoleAdmin, model.RoleOfficer, model.RoleBorrower))
	{
		allRoles.GET("/categories", a.CategoryHandler.GetAllCategories)
		allRoles.GET("/categories/:id", a.CategoryHandler.GetCategoryByID)

		allRoles.GET("/items", a.ItemHandler.GetAllItems)
		allRoles.GET("/items/:id", a.ItemHandler.GetItemByID)
	}

	adminAndOfficer := authenticated.Group("")
	adminAndOfficer.Use(middleware.RoleMiddleware(model.RoleAdmin, model.RoleOfficer))
	{
		adminAndOfficer.GET("/borrows", a.BorrowHandler.GetAllBorrows)
		adminAndOfficer.GET("/returns", a.ReturnHandler.GetAllReturns)
	}

	admin := authenticated.Group("")
	admin.Use(middleware.RoleMiddleware(model.RoleAdmin))
	{
		admin.GET("/logs", a.LogHandler.GetAllLogs)

		admin.GET("/users", a.UserHandler.GetAllUsers)
		admin.GET("/users/:id", a.UserHandler.GetUserByID)
		admin.POST("/users", a.UserHandler.CreateUser)
		admin.PUT("/users/:id", a.UserHandler.UpdateUser)

		admin.POST("/categories", a.CategoryHandler.CreateCategory)
		admin.PUT("/categories/:id", a.CategoryHandler.UpdateCategory)
		admin.DELETE("/categories/:id", a.CategoryHandler.DeleteCategory)

		admin.POST("/items", a.ItemHandler.CreateItem)
		admin.PUT("/items/:id", a.ItemHandler.UpdateItem)
	}

	borrower := authenticated.Group("")
	borrower.Use(middleware.RoleMiddleware(model.RoleBorrower))
	{
		borrower.GET("/my-borrows", a.BorrowHandler.GetAllBorrowsByUser)
		borrower.POST("/borrows", a.BorrowHandler.CreateBorrow)
		borrower.PUT("/borrows/:id/confirm", a.BorrowHandler.ConfirmBorrow)
		borrower.PUT("/borrows/:id/return", a.BorrowHandler.ReturnedBorrow)

		borrower.GET("/my-returns", a.ReturnHandler.GetAllReturnsByUser)
	}

	officer := authenticated.Group("")
	officer.Use(middleware.RoleMiddleware(model.RoleOfficer))
	{
		officer.PUT("/borrows/:id/approve", a.BorrowHandler.ApproveBorrow)
		officer.PUT("/borrows/:id/reject", a.BorrowHandler.RejectBorrow)
	}
}
