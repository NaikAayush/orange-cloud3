import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsAddComponent } from './jobs-add.component';

describe('JobsAddComponent', () => {
  let component: JobsAddComponent;
  let fixture: ComponentFixture<JobsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobsAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
