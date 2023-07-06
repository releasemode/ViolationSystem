import { TestBed } from '@angular/core/testing';

import { ViolationApiService } from './violation.api.service';

describe('ViolationApiService', () => {
  let service: ViolationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViolationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
