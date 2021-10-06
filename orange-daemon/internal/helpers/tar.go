package helpers

import (
	"archive/tar"
	"bufio"
	"bytes"
	"io"
	"log"
)

func TarFile(file []byte) (io.Reader, error){
	var buf bytes.Buffer
	tarWriter := tar.NewWriter(&buf)

	log.Printf("Printing contents of file in tar function: %v", string(file))
	
	header := &tar.Header{
		Name: "job",
		Mode: 0600,
		Size: int64(len(file)),
	}
	
	err := tarWriter.WriteHeader(header)
	if err != nil {
		return nil, err
	}
	
	_, err = tarWriter.Write(file)
	if err != nil {
		return nil, err
	}
	
	err = tarWriter.Close()
	if err != nil {
		return nil, err
	}	

	return bufio.NewReader(&buf), nil
}
