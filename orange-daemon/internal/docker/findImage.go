package docker

import (
	"context"
	"log"

	"github.com/NaikAayush/orange-cloud3/orange-daemon/internal/types"
	"github.com/docker/docker/client"
)

func Run(file []byte, runtime types.Runtime) (string, error) {
	ctx := context.Background()
	dockerClient, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return "", err
	}
	
	switch(runtime) {
	case types.Js:
		log.Println("JavaScript runtime being initialized")

	case types.Py:
		log.Println("Python runtime being initialized")
		outBytes, err := runPython(ctx, dockerClient, file)
		outString := string(outBytes)
		if err != nil {
			return outString, err
		}
		log.Println(outString)
		return outString, nil

	case types.Wasm:
		log.Println("WASM runtime being initialized")
	}
	
	return "", nil
}
