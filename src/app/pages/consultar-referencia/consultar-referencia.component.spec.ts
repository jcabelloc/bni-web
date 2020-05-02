import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarReferenciaComponent } from './consultar-referencia.component';

describe('ConsultarReferenciaComponent', () => {
  let component: ConsultarReferenciaComponent;
  let fixture: ComponentFixture<ConsultarReferenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultarReferenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarReferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
