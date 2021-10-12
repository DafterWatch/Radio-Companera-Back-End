import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmModifyComponent } from './confirm-modify.component';

describe('ConfirmModifyComponent', () => {
  let component: ConfirmModifyComponent;
  let fixture: ComponentFixture<ConfirmModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmModifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
