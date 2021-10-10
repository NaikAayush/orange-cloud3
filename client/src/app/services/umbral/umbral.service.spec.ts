import { TestBed } from '@angular/core/testing';

import { UmbralService } from './umbral.service';

describe('UmbralService', () => {
  let service: UmbralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UmbralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
