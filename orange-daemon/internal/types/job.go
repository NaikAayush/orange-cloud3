package types

type Runtime string

const (
	Py Runtime = "py"
	Js = "js"
	Wasm = "wasm"
)

type Job struct {
	Cid string `json:"cid"`
	JobRuntime Runtime `json:"job_runtime"`
}
