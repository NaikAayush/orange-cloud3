package ipfs

import (
	"io"

	shell "github.com/ipfs/go-ipfs-api"
)

func Upload(sh *shell.Shell, fileContents io.Reader) (string, error) {
    cid, err := sh.Add(fileContents)
    if err != nil {
        return "", err
    }
    return cid, nil
}
