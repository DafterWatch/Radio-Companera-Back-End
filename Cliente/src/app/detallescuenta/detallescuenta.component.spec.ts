import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallescuentaComponent } from './detallescuenta.component';

describe('DetallescuentaComponent', () => {
  let component: DetallescuentaComponent;
  let fixture: ComponentFixture<DetallescuentaComponent>;

  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallescuentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallescuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
