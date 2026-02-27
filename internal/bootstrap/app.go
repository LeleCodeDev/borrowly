// Package bootstrap
package bootstrap

import (
	"reflect"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
	"github.com/lelecodedev/borrowly/internal/database"
	"github.com/lelecodedev/borrowly/internal/handler"
	"github.com/lelecodedev/borrowly/internal/middleware"
	"github.com/lelecodedev/borrowly/internal/repository"
	"github.com/lelecodedev/borrowly/internal/service"
	"gorm.io/gorm"
)

type App struct {
	Router          *gin.Engine
	DB              *gorm.DB
	AuthMiddleware  gin.HandlerFunc
	AuthHandler     *handler.AuthHandler
	UserHandler     *handler.UserHandler
	CategoryHandler *handler.CategoryHandler
	ItemHandler     *handler.ItemHandler
	BorrowHandler   *handler.BorrowHandler
	LogHandler      *handler.LogHandler
	ReturnHandler   *handler.ReturnHandler
}

func NewApp() *App {
	setupValidator()

	r := gin.Default()
	db := database.NewDB()
	txManager := repository.NewTxManager(db)

	logRepo := repository.NewLogActivityRepository(db)
	logService := service.NewLogService(logRepo)

	userRepo := repository.NewUserRepository(db)
	userService := service.NewUserService(txManager, userRepo, logRepo)

	authService := service.NewAuthRepository(txManager, userRepo)

	categoryRepo := repository.NewCategoryRepository(db)
	categoryService := service.NewCategoryService(txManager, categoryRepo, logRepo)

	itemRepo := repository.NewItemRepository(db)
	itemService := service.NewItemService(txManager, itemRepo, categoryRepo, logRepo)

	borrowRepo := repository.NewBorrowRepository(db)
	borrowService := service.NewBorrowService(txManager, borrowRepo, itemRepo, logRepo)

	returnRepo := repository.NewReturnRepository(db)
	returnService := service.NewReturnService(returnRepo)

	app := &App{
		Router:          r,
		DB:              db,
		AuthMiddleware:  middleware.AuthMiddleware(userRepo),
		UserHandler:     handler.NewUserHandler(userService),
		AuthHandler:     handler.NewAuthHandler(authService),
		CategoryHandler: handler.NewCategoryHandler(categoryService),
		ItemHandler:     handler.NewItemHandler(itemService),
		BorrowHandler:   handler.NewBorrowHandler(borrowService),
		LogHandler:      handler.NewLogHandler(logService),
		ReturnHandler:   handler.NewReturnHandler(returnService),
	}

	app.RegisterRoute()

	return app
}

func (a *App) Run(addr string) error {
	err := a.Router.Run(addr)
	return err
}

func setupValidator() {
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterTagNameFunc(func(field reflect.StructField) string {
			name := strings.SplitN(field.Tag.Get("json"), ",", 2)[0]
			return name
		})
	}
}
