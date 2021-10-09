package docker

import (
	"context"
	"io"
	"os"

	"github.com/NaikAayush/orange-cloud3/orange-daemon/internal/helpers"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
)

func runPython(ctx context.Context, dockerClient *client.Client, file []byte) (string, error) {
	reader, err := dockerClient.ImagePull(ctx, "docker.io/library/python:latest", types.ImagePullOptions{})
	if err != nil {
		return "", err
	}
	io.Copy(os.Stdout, reader)

	resp, err := dockerClient.ContainerCreate(ctx, &container.Config{
		Image: "python",
		Cmd:   []string{"python", "job"},
	}, nil, nil, nil, "orange-python")
	if err != nil {
		return "", err
	}

	scriptToCopy, err := helpers.TarFile(file)
	if err != nil {
		return "", err
	}

	err = dockerClient.CopyToContainer(ctx, resp.ID, "/", scriptToCopy, types.CopyToContainerOptions{})
	if err != nil {
		return "", err
	}

	err = dockerClient.ContainerStart(ctx, resp.ID, types.ContainerStartOptions{})
	if err != nil {
		return "", err
	}

	return resp.ID, nil
}
