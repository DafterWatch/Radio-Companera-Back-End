import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicidadesComponent } from './publicidades.component';

describe('PublicidadesComponent', () => {
  let component: PublicidadesComponent;
  let fixture: ComponentFixture<PublicidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicidadesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
