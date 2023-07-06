import { TestBed } from '@angular/core/testing';

import { GsbService } from './gsb.service';

describe('GsbService', () => {
  let service: GsbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GsbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
