import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthPwMnFormComponent } from './auth-pw-mn-form.component';

describe('AuthPwMnFormComponent', () => {
  let component: AuthPwMnFormComponent;
  let fixture: ComponentFixture<AuthPwMnFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthPwMnFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthPwMnFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
