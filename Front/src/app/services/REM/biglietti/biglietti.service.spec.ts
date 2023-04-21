import { TestBed } from '@angular/core/testing';

import { BigliettiService } from './biglietti.service';

describe('BigliettiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BigliettiService = TestBed.get(BigliettiService);
    expect(service).toBeTruthy();
  });
});
