package ipfs

import (
	"bufio"
	"log"

	shell "github.com/ipfs/go-ipfs-api"
)

func ReadFile(sh *shell.Shell, cid string) ([]byte, error) {
	log.Printf("Printing CID of file: %v", cid)
	fileReader, err := sh.Cat(cid)
	if err != nil {
		return nil, err
	}

	buffReader := bufio.NewScanner(fileReader)
	file := buffReader.Bytes()
	log.Printf("Printing contents of file from ipfs: %v", string(file))
	err = fileReader.Close()
	if err != nil {
		return nil, err
	}
	
	return file, nil
}
