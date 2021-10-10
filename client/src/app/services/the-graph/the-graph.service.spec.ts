import { TestBed } from '@angular/core/testing';

import { TheGraphService } from './the-graph.service';

describe('TheGraphService', () => {
  let service: TheGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TheGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
