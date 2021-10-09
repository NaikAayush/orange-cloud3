// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// add ability to return structs directly
pragma experimental ABIEncoderV2;

contract Orange {
    struct Job {
        // to check if the job exists in jobStore
        // ref: https://ethereum.stackexchange.com/a/13029
        bool isValid;
        // IPFS CID of the code file/folder
        string cid;
        // type of job -> python, wasm, etc.
        string type_;
        // job name
        string name;
        // job not yet accepted by anyone
        bool available;
        // address of user who accepted the job (if not available)
        address acceptedBy;
        // cid of output file
        string outputCid;
        // system requirements
        uint8 numCpus;
        uint128 memBytes;
    }

    mapping(uint256 => Job) jobStore;
    uint256[] jobIds;

    constructor() public {}

    function getJob(uint256 jobId) public view returns (Job memory) {
        Job memory job = jobStore[jobId];

        require(job.isValid, "Job with given ID does not exist");

        return job;
    }

    function addJob(
        uint256 id,
        string memory cid,
        string memory type_,
        string memory name,
        uint8 numCpus,
        uint128 memBytes
    ) public {
        Job memory job = Job(
            true,
            cid,
            type_,
            name,
            true,
            address(0),
            "",
            numCpus,
            memBytes
        );

        // // random ID
        // // ref: https://stackoverflow.com/a/67332959
        // uint256 id = uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));

        jobStore[id] = job;
        jobIds.push(id);
    }

    function acceptJob(uint256 id, address acceptor) public {
        Job memory job = jobStore[id];

        require(job.isValid, "Job does not exist");
        require(job.available, "Job is not available");

        job.available = false;
        job.acceptedBy = acceptor;

        jobStore[id] = job;
    }

    function putJobOutput(uint256 id, string memory cid) public {
        Job memory job = jobStore[id];

        require(job.isValid, "Job does not exist");

        job.outputCid = cid;

        jobStore[id] = job;
    }
}
