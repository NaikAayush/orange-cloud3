package docker

import (
	"context"
	"log"

	"github.com/NaikAayush/orange-cloud3/orange-daemon/internal/types"
	"github.com/docker/docker/client"
)

func Run(ctx context.Context, dockerClient *client.Client, file []byte, runtime types.Runtime) (string, error) {
	switch runtime {
	case types.Js:
		log.Println("JavaScript runtime being initialized")

	case types.Py:
		log.Println("Python runtime being initialized")
		containerID, err := runPython(ctx, dockerClient, file)
		if err != nil {
			return "", err
		}
		return containerID, nil

	case types.Wasm:
		log.Println("WASM runtime being initialized")
	}

	return "", nil
}
