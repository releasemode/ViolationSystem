import { TestBed } from '@angular/core/testing';

import { ViolationResolver } from './violation.resolver';

describe('ViolationResolver', () => {
  let resolver: ViolationResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ViolationResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
