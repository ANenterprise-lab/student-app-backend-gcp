import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableCreate } from './timetable-create';

describe('TimetableCreate', () => {
  let component: TimetableCreate;
  let fixture: ComponentFixture<TimetableCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimetableCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimetableCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
