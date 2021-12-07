import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAcountComponent } from './detail-acount.component';

describe('DetailAcountComponent', () => {
  let component: DetailAcountComponent;
  let fixture: ComponentFixture<DetailAcountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailAcountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAcountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
