import { TestBed } from '@angular/core/testing';

import { PagamentiService } from './pagamenti.service';

describe('PagamentiService', () => {
  let service: PagamentiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagamentiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
