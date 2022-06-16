import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserPreviewComponent } from './admin-user-preview.component';

describe('AdminUserPreviewComponent', () => {
  let component: AdminUserPreviewComponent;
  let fixture: ComponentFixture<AdminUserPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUserPreviewComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
