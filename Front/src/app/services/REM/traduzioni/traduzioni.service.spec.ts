import { TestBed } from '@angular/core/testing';

import { TraduzioniService } from './traduzioni.service';

describe('TraduzioniService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TraduzioniService = TestBed.get(TraduzioniService);
    expect(service).toBeTruthy();
  });
});
