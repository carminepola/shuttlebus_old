import { TestBed } from '@angular/core/testing';

import { FermateService } from './fermate.service';

describe('FermateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FermateService = TestBed.get(FermateService);
    expect(service).toBeTruthy();
  });
});
