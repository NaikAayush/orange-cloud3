import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsGlobalComponent } from './jobs-global.component';

describe('JobsGlobalComponent', () => {
  let component: JobsGlobalComponent;
  let fixture: ComponentFixture<JobsGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobsGlobalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
