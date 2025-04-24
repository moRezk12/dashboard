import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsproforstoreComponent } from './detailsproforstore.component';

describe('DetailsproforstoreComponent', () => {
  let component: DetailsproforstoreComponent;
  let fixture: ComponentFixture<DetailsproforstoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsproforstoreComponent]
    });
    fixture = TestBed.createComponent(DetailsproforstoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
