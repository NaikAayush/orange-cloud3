# Orange Daemon
Daemon that connects to docker and ipfs and runs jobs. 
Provides an API with the following endpoints

As of now only python runtime works, javascript and WASM are yet to be implemented.

## Endpoints
### /job/start
Starts the job and returns container_id. expects a file to be uploaded
- type: `post`
- `$URL/runJob?job_runtime=<"py"/"js"/"wasm">`
- res: `{'container_id': <container_id>}`
### /job/status
Checks the job status
- type: `get`
- `$URL/job/status?container_id=<container_id>`
- res: `{'status': <status>}`
- status is one of
  - 'created'
  - 'running'
  - 'paused'
  - 'restarting'
  - 'removing'
  - 'exited'
  - 'dead'

###  /job/error
Gets the error if any
- type: `get`
- `$URL/job/error?container_id=<container_id>`
- res: `{'error': <error>}`
- error is empty if nothing

### /job/exitcode
Gets the exitcode if any
- type: `get`
- `$URL/job/exitcode?container_id=<container_id>`
- res: `{'exitcode': <exitcode>}`


### /job/output
Gets the cid of the file containing output
- type: `get`
- `$URL/job/output?container_id=<container_id>`
- res: `{'cid': <cid>}`

### /ipfs/upload
Uploads a file to ipfs and returns the cid
- type `post`
- `$URL/ipfs/upload`
- res: `{'cid': <cid>}`

### /ipfs/contents
Returns the contents of a file given the cid
- type `get`
- `$URL/ipfs/contents?cid=<cid>`
- res: string containing the contents of the file from ipfs
