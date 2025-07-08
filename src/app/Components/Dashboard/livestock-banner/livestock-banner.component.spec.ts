import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivestockBannerComponent } from './livestock-banner.component';

describe('LivestockBannerComponent', () => {
  let component: LivestockBannerComponent;
  let fixture: ComponentFixture<LivestockBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LivestockBannerComponent]
    });
    fixture = TestBed.createComponent(LivestockBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
