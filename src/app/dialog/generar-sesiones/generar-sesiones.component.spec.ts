import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarSesionesComponent } from './generar-sesiones.component';

describe('GenerarSesionesComponent', () => {
  let component: GenerarSesionesComponent;
  let fixture: ComponentFixture<GenerarSesionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerarSesionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarSesionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
