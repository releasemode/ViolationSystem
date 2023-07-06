import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationActionComponent } from './violation-action.component';

describe('ViolationActionComponent', () => {
  let component: ViolationActionComponent;
  let fixture: ComponentFixture<ViolationActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViolationActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViolationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
