import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditestadoComponent } from './editestado.component';

describe('EditestadoComponent', () => {
  let component: EditestadoComponent;
  let fixture: ComponentFixture<EditestadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditestadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditestadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
