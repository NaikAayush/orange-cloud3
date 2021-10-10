import { TestBed } from '@angular/core/testing';

import { SuperfluidService } from './superfluid.service';

describe('SuperfluidService', () => {
  let service: SuperfluidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperfluidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
