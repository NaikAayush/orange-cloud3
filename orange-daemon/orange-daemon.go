package main

import (
	"net/http"

	"github.com/NaikAayush/orange-cloud3/orange-daemon/internal/docker"
	"github.com/NaikAayush/orange-cloud3/orange-daemon/internal/ipfs"
	"github.com/NaikAayush/orange-cloud3/orange-daemon/internal/types"
	"github.com/gin-gonic/gin"
	shell "github.com/ipfs/go-ipfs-api"
)

func main() {
	sh := shell.NewLocalShell()

	router := gin.Default()
	router.POST("/runJob", func(c *gin.Context) {
		var job types.Job
		err := c.ShouldBindJSON(&job)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		file, err := ipfs.ReadFile(sh, job.Cid)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		
		out, err := docker.Run(file, job.JobRuntime)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}		
		
		c.JSON(http.StatusOK, gin.H{"status": "success!", "output": out})
	})

	router.Run("0.0.0.0:4000")
}







