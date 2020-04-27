import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmSesionesComponent } from './adm-sesiones.component';

describe('AdmSesionesComponent', () => {
  let component: AdmSesionesComponent;
  let fixture: ComponentFixture<AdmSesionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmSesionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmSesionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
