import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGrupoComponent } from './delete-grupo.component';

describe('DeleteGrupoComponent', () => {
  let component: DeleteGrupoComponent;
  let fixture: ComponentFixture<DeleteGrupoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteGrupoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
