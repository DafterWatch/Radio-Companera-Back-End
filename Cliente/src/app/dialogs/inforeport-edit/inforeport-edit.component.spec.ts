import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InforeportEditComponent } from './inforeport-edit.component';

describe('InforeportEditComponent', () => {
  let component: InforeportEditComponent;
  let fixture: ComponentFixture<InforeportEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InforeportEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InforeportEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
