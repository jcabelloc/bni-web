import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarMiembroComponent } from './buscar-miembro.component';

describe('BuscarMiembroComponent', () => {
  let component: BuscarMiembroComponent;
  let fixture: ComponentFixture<BuscarMiembroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarMiembroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarMiembroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
