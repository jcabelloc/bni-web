import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmGruposComponent } from './adm-grupos.component';

describe('AdmGruposComponent', () => {
  let component: AdmGruposComponent;
  let fixture: ComponentFixture<AdmGruposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmGruposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
