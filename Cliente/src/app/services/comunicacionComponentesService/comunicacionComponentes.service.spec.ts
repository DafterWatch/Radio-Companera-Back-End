import { TestBed } from '@angular/core/testing';

import { comunicacionComponentesService } from './comunicacionComponentes.service';

describe('comunicacionComponentesService', () => {
  let service: comunicacionComponentesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(comunicacionComponentesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
