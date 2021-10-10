package docker

import (
	"context"
	"io/ioutil"

	shell "github.com/ipfs/go-ipfs-api"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
)

func CheckContainerStatus(ctx context.Context, dockerClient *client.Client, containerID string) (string, error) {
	res, err := dockerClient.ContainerInspect(ctx, containerID)
	if err != nil {
		return "", err
	}
	return res.ContainerJSONBase.State.Status, nil
}

func ContainerExitCode(ctx context.Context, dockerClient *client.Client, containerID string) (int, error) {
	res, err := dockerClient.ContainerInspect(ctx, containerID)
	if err != nil {
		return 0, err
	}

	return res.ContainerJSONBase.State.ExitCode, nil
}

func ContainerError(ctx context.Context, dockerClient *client.Client, containerID string) (string, error) {
	res, err := dockerClient.ContainerInspect(ctx, containerID)
	if err != nil {
		return "", err
	}

	return res.ContainerJSONBase.State.Error, nil
}

func JobOutput(ctx context.Context, dockerClient *client.Client, sh *shell.Shell, containerID string) (string, error) {
	res, err := dockerClient.ContainerLogs(ctx, containerID, types.ContainerLogsOptions{
        ShowStdout: true,
        ShowStderr: true,
    })
	if err != nil {
		return "", err
	}

	fileContents, err := ioutil.ReadAll(res)
    res.Close()
	if err != nil {
		return "", err
	}

	return string(fileContents), nil
}
