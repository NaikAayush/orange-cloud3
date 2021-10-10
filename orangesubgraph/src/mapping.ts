import {
        orange,
        JobAccepted,
        JobCreated,
        JobOutputPut
} from "../generated/orange/orange"
import { JobEntity } from "../generated/schema"

export function handleJobAccepted(event: JobAccepted): void {
        let job = JobEntity.load(event.params.id.toString());
        if (!job) {
                throw "JobEntity is null";
        }
        job.acceptedBy = event.params.acceptor.toString();
        job.available = false;
        job.save();
}

export function handleJobCreated(event: JobCreated): void {
        let job = new JobEntity(event.params.id.toString());
        if (!job) {
                throw "JobEntity is null";
        }
        job.name = event.params.name;
        job.type_ = event.params.type_;
        job.cid = event.params.cid;
        job.available = true;
        job.acceptedBy = "";
        job.outputCid = "";
        job.numCpus = event.params.numCpus;
        job.memBytes = event.params.memBytes;
        job.save();
}

export function handleJobOutputPut(event: JobOutputPut): void {
        let job = JobEntity.load(event.params.id.toString());
        if (!job) {
                throw "JobEntity is null";
        }
        job.outputCid = event.params.cid;
        job.save();
}
