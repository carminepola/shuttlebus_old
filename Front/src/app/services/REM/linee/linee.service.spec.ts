import { TestBed } from '@angular/core/testing';

import { LineeService } from './linee.service';

describe('LineeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LineeService = TestBed.get(LineeService);
    expect(service).toBeTruthy();
  });
});
