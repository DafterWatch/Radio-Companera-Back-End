import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPublicidadComponent } from './edit-publicidad.component';

describe('EditPublicidadComponent', () => {
  let component: EditPublicidadComponent;
  let fixture: ComponentFixture<EditPublicidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPublicidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPublicidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
