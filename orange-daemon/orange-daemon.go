package main

import (
	"net/http"

	"github.com/NaikAayush/orange-cloud3/orange-daemon/internal/types"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.POST("/runJob", func(c *gin.Context) {
		var job types.Job
		err := c.ShouldBindJSON(&job)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err})
		} else {
			c.JSON(http.StatusOK, gin.H{"status": "success!"})
		}
	})
}
