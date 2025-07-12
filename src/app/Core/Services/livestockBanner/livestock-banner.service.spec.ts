import { TestBed } from '@angular/core/testing';

import { LivestockBannerService } from './livestock-banner.service';

describe('LivestockBannerService', () => {
  let service: LivestockBannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LivestockBannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
