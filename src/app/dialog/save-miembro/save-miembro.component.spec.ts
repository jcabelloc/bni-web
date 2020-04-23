import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveMiembroComponent } from './save-miembro.component';

describe('SaveMiembroComponent', () => {
  let component: SaveMiembroComponent;
  let fixture: ComponentFixture<SaveMiembroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveMiembroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveMiembroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
