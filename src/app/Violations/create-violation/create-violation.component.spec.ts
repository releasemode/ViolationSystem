import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateViolationComponent } from './create-violation.component';

describe('CreateViolationComponent', () => {
  let component: CreateViolationComponent;
  let fixture: ComponentFixture<CreateViolationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateViolationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateViolationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
