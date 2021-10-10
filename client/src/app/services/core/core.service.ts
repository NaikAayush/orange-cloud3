import { Injectable } from '@angular/core';
import { ContractService } from '../contract/contract.service';
import { TheGraphService } from '../the-graph/the-graph.service';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  public takenJobCount = 0;

  constructor(
    public graph: TheGraphService,
    public contract: ContractService
  ) {
    this.jobChecker();
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
        await this.contract.acceptJob(firstJob.id);
        this.takenJobCount++;
      }

      await this.sleep(10000);
    }
  }
}
