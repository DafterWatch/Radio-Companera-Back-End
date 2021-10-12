import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListacuentasComponent } from './listacuentas.component';

describe('ListacuentasComponent', () => {
  let component: ListacuentasComponent;
  let fixture: ComponentFixture<ListacuentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListacuentasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListacuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
