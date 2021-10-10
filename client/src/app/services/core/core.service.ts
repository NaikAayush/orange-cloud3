import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContractService } from '../contract/contract.service';
import { DaemonService } from '../daemon/daemon.service';
import { Job, TheGraphService } from '../the-graph/the-graph.service';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  public takenJobCount = 0;

  constructor(
    public graph: TheGraphService,
    public contract: ContractService,
    public daemon: DaemonService
  ) {
    this.jobChecker();
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async acceptJob(job: Job) {
    this.takenJobCount++;

    await this.contract.acceptJob(job.id);

    console.log("CID", job.cid);

    const contents = await this.daemon.getFromIPFS(job.cid);
    console.log("Contents of file:", contents);

    const file = new File([contents], "job");

    const startResp = await this.daemon.startNewJob(file, job.type_) as HttpResponse<any>;
    const containerId: string = startResp.body.container_id;

    console.log("Container ID", containerId);

    await this.jobStatusChecker(containerId);

    const output = await this.daemon.jobOutput(containerId);

    console.log("Job output", output);

    const res = await this.daemon.uploadToIPFS(new File([output], "output")) as HttpResponse<any>;
    const outputCID = res.body.cid;

    const outputput = await this.contract.putJobOutput(job.id, outputCID);
    console.log("Put Output", outputput);
  }

  public async jobStatusChecker(containerId: string) {
    while (true) {
      const res = await this.daemon.jobStatus(containerId);
      const data = JSON.parse(res);

      console.log("Job status", containerId, data);

      if (data.status === "exited") {
        break;
      }

      await this.sleep(1000);
    }
  }

  public async jobChecker() {
    while (true) {
      const res = await this.graph.getAvailableJobs();
      const jobs = res.data.jobEntities;

      if (jobs.length == 0) {
        console.log('No jobs found');
      } else {
        console.log(jobs);
        const firstJob = jobs[0];
        await this.acceptJob(firstJob);
      }

      await this.sleep(10000);
    }
  }
}
