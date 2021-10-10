package docker

import (
	"context"
	"log"

	"github.com/NaikAayush/orange-cloud3/orange-daemon/internal/types"
	"github.com/docker/docker/client"
)

func Run(ctx context.Context, dockerClient *client.Client, fileContents []byte, runtime types.Runtime) (string, error) {
	switch runtime {
	case "js":
		log.Println("JavaScript runtime being initialized")

	case "py":
		log.Println("Python runtime being initialized")

        containerID, err := runPython(ctx, dockerClient, fileContents)
		if err != nil {
			return "", err
		}
		return containerID, nil

	case "wasm":
		log.Println("WASM runtime being initialized")
	}

	return "", nil
}
