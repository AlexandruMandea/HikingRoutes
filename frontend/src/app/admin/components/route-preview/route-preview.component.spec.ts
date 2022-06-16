import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePreviewComponent } from './route-preview.component';

describe('RoutePreviewComponent', () => {
  let component: RoutePreviewComponent;
  let fixture: ComponentFixture<RoutePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
