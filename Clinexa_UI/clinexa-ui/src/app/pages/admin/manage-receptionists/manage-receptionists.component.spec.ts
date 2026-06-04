import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageReceptionistsComponent } from './manage-receptionists.component';

describe('ManageReceptionistsComponent', () => {
  let component: ManageReceptionistsComponent;
  let fixture: ComponentFixture<ManageReceptionistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageReceptionistsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageReceptionistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
