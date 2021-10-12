import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAcountComponent } from './add-acount.component';

describe('AddAcountComponent', () => {
  let component: AddAcountComponent;
  let fixture: ComponentFixture<AddAcountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAcountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAcountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
