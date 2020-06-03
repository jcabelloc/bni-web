import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUsuarioComponent } from './save-usuario.component';

describe('SaveUsuarioComponent', () => {
  let component: SaveUsuarioComponent;
  let fixture: ComponentFixture<SaveUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
