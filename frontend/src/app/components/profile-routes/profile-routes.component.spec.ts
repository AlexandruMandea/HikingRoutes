import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileRoutesComponent } from './profile-routes.component';

describe('ProfileRoutesComponent', () => {
  let component: ProfileRoutesComponent;
  let fixture: ComponentFixture<ProfileRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileRoutesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
