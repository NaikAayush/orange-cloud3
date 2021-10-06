package docker

import (
	"context"
	"log"

	"github.com/NaikAayush/orange-cloud3/orange-daemon/internal/types"
	"github.com/docker/docker/client"
)

func Run(file []byte, runtime types.Runtime) error {
	ctx := context.Background()
	dockerClient, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return err
	}
	
	switch(runtime) {
	case types.Js:
		log.Println("JavaScript runtime being initialized")
	case types.Py:
		log.Println("Python runtime being initialized")
		val ,err := runPython(ctx, dockerClient, file)
		if err != nil {
			return err
		}
		log.Println(string(val))
	case types.Wasm:
		log.Println("WASM runtime being initialized")
	}
	
	return nil
}
