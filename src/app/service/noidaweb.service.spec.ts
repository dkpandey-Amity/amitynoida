import { TestBed } from '@angular/core/testing';

import { NoidawebService } from './noidaweb.service';

describe('NoidawebService', () => {
  let service: NoidawebService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoidawebService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
