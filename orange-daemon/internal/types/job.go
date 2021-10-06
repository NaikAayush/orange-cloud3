package types

type Runtime int

const (
	Py Runtime = iota
	Js
	Wasm
)

type Job struct {
	Path string `json:"path"`
	JobRuntime Runtime `json:"job_runtime"`
}
