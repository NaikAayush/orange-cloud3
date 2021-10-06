package docker

import (
	"context"
	"io"
	"io/ioutil"

	"os"

	"github.com/NaikAayush/orange-cloud3/orange-daemon/internal/helpers"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
)

func runPython(ctx context.Context, dockerClient *client.Client, file []byte) ([]byte ,error) {
	reader, err := dockerClient.ImagePull(ctx, "docker.io/library/python:latest", types.ImagePullOptions{})
	if err != nil {
		return nil, err
	}
	io.Copy(os.Stdout, reader)

	resp, err := dockerClient.ContainerCreate(ctx, &container.Config{
		Image: "python",
		Cmd: []string {"python", "job"},
	}, nil, nil, nil, "orange-python")
	if err != nil {
		return nil, err
	}

	scriptToCopy, err := helpers.TarFile(file)
	if err != nil {
		return nil, err
	}

	err = dockerClient.CopyToContainer(ctx, resp.ID, "/", scriptToCopy, types.CopyToContainerOptions{})
	if err != nil {
		return nil, err
	}

	err = dockerClient.ContainerStart(ctx, resp.ID, types.ContainerStartOptions{})
	if err != nil {
		return nil, err
	}

	statusCh, errCh := dockerClient.ContainerWait(ctx, resp.ID, container.WaitConditionNotRunning)
	select {
	case err := <-errCh:
		if err != nil {
			return nil, err
		}
	case <-statusCh:
	}

	out, err := dockerClient.ContainerLogs(ctx, resp.ID, types.ContainerLogsOptions{ShowStdout: true})
	if err != nil {
		return nil, err
	}
	
	output, err := ioutil.ReadAll(out)
	if err != nil {
		return nil, err
	}	

	err = dockerClient.ContainerRemove(ctx, resp.ID, types.ContainerRemoveOptions{})
	if err != nil {
		return nil, err
	}

	return output, nil
}
