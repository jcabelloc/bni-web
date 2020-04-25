import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveGrupoComponent } from './save-grupo.component';

describe('SaveGrupoComponent', () => {
  let component: SaveGrupoComponent;
  let fixture: ComponentFixture<SaveGrupoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveGrupoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
