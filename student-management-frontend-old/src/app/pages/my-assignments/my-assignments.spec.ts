import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAssignments } from './my-assignments';

describe('MyAssignments', () => {
  let component: MyAssignments;
  let fixture: ComponentFixture<MyAssignments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAssignments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAssignments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
