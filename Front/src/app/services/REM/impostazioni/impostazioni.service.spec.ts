import { TestBed } from '@angular/core/testing';

import { ImpostazioniService } from './impostazioni.service';

describe('ImpostazioniService', () => {
  let service: ImpostazioniService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpostazioniService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
