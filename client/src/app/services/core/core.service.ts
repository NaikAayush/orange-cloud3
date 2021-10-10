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
    await this.contract.acceptJob(job.id);

    const contents = this.daemon.getFromIPFS(job.cid);
    console.log("Contents of file:", contents)

    this.takenJobCount++;
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
