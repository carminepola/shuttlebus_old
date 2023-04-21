import { TestBed } from '@angular/core/testing';

import { RemService } from './rem.service';

describe('RemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RemService = TestBed.get(RemService);
    expect(service).toBeTruthy();
  });
});
