# Orange Daemon
Daemon that connects to docker and ipfs and runs jobs. 
Provides an API with the following endpoints

As of now only python runtime works, javascript and WASM are yet to be implemented.

## Endpoints
### /job/start
Starts the job and returns container_id
- type: `post`
- `$URL/runJob`
- body: ```
{
	"cid": <ipfs_cid_of_script>,
	"job_runtime": <"py"/"js"/"wasm">,
}
```
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
