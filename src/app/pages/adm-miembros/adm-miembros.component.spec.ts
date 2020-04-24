import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmMiembrosComponent } from './adm-miembros.component';

describe('AdmMiembrosComponent', () => {
  let component: AdmMiembrosComponent;
  let fixture: ComponentFixture<AdmMiembrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmMiembrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmMiembrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
