package main

import (
	"context"
	"log"
	"net/http"

	"github.com/NaikAayush/orange-cloud3/orange-daemon/internal/docker"
	"github.com/NaikAayush/orange-cloud3/orange-daemon/internal/ipfs"
	"github.com/NaikAayush/orange-cloud3/orange-daemon/internal/types"
	"github.com/docker/docker/client"
	"github.com/gin-gonic/gin"
	shell "github.com/ipfs/go-ipfs-api"
)

func main() {
	sh := shell.NewLocalShell()

	ctx := context.Background()
	dockerClient, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		panic(err)
	}

	router := gin.Default()
	router.POST("/job/start", func(c *gin.Context) {
		var job types.Job
		err := c.ShouldBindJSON(&job)
		if err != nil {
			log.Printf("Error unmarshalling JSON: %v", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		file, err := ipfs.ReadFile(sh, job.Cid)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		containerID, err := docker.Run(ctx, dockerClient, file, job.JobRuntime)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"container_id": containerID})
	})

	router.GET("/job/status", func(c *gin.Context) {
		containerID := c.Query("container_id")
		status, err := docker.CheckContainerStatus(ctx, dockerClient, containerID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"status": status})
	})

	router.GET("/job/error", func(c *gin.Context) {
		containerID := c.Query("container_id")
		error, err := docker.ContainerError(ctx, dockerClient, containerID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"error": error})
	})

	router.GET("/job/exitcode", func(c *gin.Context) {
		containerID := c.Query("container_id")
		exitcode, err := docker.ContainerExitCode(ctx, dockerClient, containerID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"exit_code": exitcode})
	})

	router.Run("0.0.0.0:4000")
}
