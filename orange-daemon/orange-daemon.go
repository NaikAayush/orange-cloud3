package main

import (
	"context"
	"io/ioutil"
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
		runtime := c.Query("job_runtime")
		var jobRuntime types.Runtime
		switch {
		case runtime == "py":
			jobRuntime = types.Py
		case runtime == "js":
			jobRuntime = types.Js
		case runtime == "wasm":
			jobRuntime = types.Wasm
		default:
			c.JSON(http.StatusBadRequest, gin.H{"error": "Wrong runtime type"})
			return
		}

		file, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		fileReader, err := file.Open()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		fileContents, err := ioutil.ReadAll(fileReader)
		fileReader.Close()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		log.Printf("File contents: %v", fileContents)

		containerID, err := docker.Run(ctx, dockerClient, fileContents, jobRuntime)
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

	router.GET("/job/output", func(c *gin.Context) {
		containerID := c.Query("container_id")
		output, err := docker.JobOutput(ctx, dockerClient, sh, containerID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.String(http.StatusOK, string(output))
	})

	router.POST("/ipfs/upload", func(c *gin.Context) {
		file, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		fileContents, err := file.Open()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		defer fileContents.Close()

		cid, err := ipfs.Upload(sh, fileContents)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"cid": cid})
	})

	router.GET("/ipfs/contents", func(c *gin.Context) {
		cid := c.Query("cid")
		output, err := ipfs.ReadFile(sh, cid)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.String(http.StatusOK, string(output))
	})

	router.Run("0.0.0.0:4000")
}
