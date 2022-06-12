import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteDialogComponent } from './route-dialog.component';

describe('RouteDialogComponent', () => {
  let component: RouteDialogComponent;
  let fixture: ComponentFixture<RouteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
