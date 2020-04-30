import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSesionComponent } from './edit-sesion.component';

describe('EditSesionComponent', () => {
  let component: EditSesionComponent;
  let fixture: ComponentFixture<EditSesionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSesionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
