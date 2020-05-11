import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMiembroComponent } from './delete-miembro.component';

describe('DeleteMiembroComponent', () => {
  let component: DeleteMiembroComponent;
  let fixture: ComponentFixture<DeleteMiembroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteMiembroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteMiembroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
