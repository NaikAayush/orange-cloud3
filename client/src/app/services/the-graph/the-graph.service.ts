import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

export interface Job {
  id: string;
  name: string;
  type_: string;
  cid: string;
  available: boolean;
  acceptedBy: string;
  outputCid: string;
  numCpus: number;
  memBytes: number;
}

interface AvailableJobs {
  jobEntities: Job[];
}

interface SingleJob {
  jobEntities: Job;
}

@Injectable({
  providedIn: 'root'
})
export class TheGraphService {
  QUERY_GET_AVAILABLE_JOBS = gql`
  query getAvailableJobs{
    jobEntities(first: 5, where:{available: true}) {
      id
      name
      type_
      cid
      available
      acceptedBy
      outputCid
      numCpus
      memBytes
    }
  }
  `;

  QUERY_GET_GIVEN_JOB = gql`
  query getJobByID($id: ID!) {
    jobEntities(where:{id: $id}) {
      id
      name
      type_
      cid
      available
      acceptedBy
      outputCid
      numCpus
      memBytes
    }
  }
  `;

  loading: boolean = false;

  constructor(private apollo: Apollo) {}

  async getAvailableJobs() {
    this.loading = true;
    const results = await this.apollo.query<AvailableJobs>({
      query: this.QUERY_GET_AVAILABLE_JOBS,
    }).toPromise();
    this.loading = false;
    return results;
  }

  async getJobByID(id: string) {
    this.loading = true;
    const results = await this.apollo.query<SingleJob>({
      query: this.QUERY_GET_GIVEN_JOB,
      variables: {
        id: id,
      },
    }).toPromise();
    this.loading = false;
    return results;
  }
}
