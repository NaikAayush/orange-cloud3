import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class TheGraphService {
  QUERY_GET_AVAILABLE_JOBS = gql`
  {
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
  query($id: ID!) {
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

  constructor(private apollo: Apollo) {}
}
