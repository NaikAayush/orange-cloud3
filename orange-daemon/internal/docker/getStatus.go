package docker

import (
	"context"

	"github.com/docker/docker/client"
)

func CheckContainerStatus(ctx context.Context, dockerClient *client.Client, containerID string) (string, error){
	res, err := dockerClient.ContainerInspect(ctx, containerID)
	if err != nil {
		return "", nil
	}
	return res.ContainerJSONBase.State.Status, nil
}

func ContainerExitCode(ctx context.Context, dockerClient *client.Client, containerID string) (int, error){
	res, err := dockerClient.ContainerInspect(ctx, containerID)
	if err != nil {
		return 0, nil
	}
	
	return res.ContainerJSONBase.State.ExitCode, nil
}

func ContainerError(ctx context.Context, dockerClient *client.Client, containerID string) (string, error){
	res, err := dockerClient.ContainerInspect(ctx, containerID)
	if err != nil {
		return "", nil
	}
	
	return res.ContainerJSONBase.State.Error, nil
}
