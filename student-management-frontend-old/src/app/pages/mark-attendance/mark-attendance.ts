import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Api, Course, User, Timetable, SimpleCourse } from '../../services/api'; // Import SimpleCourse

@Component({
  selector: 'app-mark-attendance',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mark-attendance.html',
  styleUrl: './mark-attendance.css'
})
export class MarkAttendance implements OnInit {
  attendanceForm: FormGroup;
  timetableEntries: Timetable[] = [];
  courses: Course[] = []; // Still needed to get the full student list
  studentsForSession: User[] = [];

  constructor(private apiService: Api, private fb: FormBuilder) {
    this.attendanceForm = this.fb.group({
      timetable_entry: [null, Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      studentAttendance: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.apiService.getTimetables().subscribe(data => {
      this.timetableEntries = data;
    });
    // We still fetch all courses to easily find the one with the full student list
    this.apiService.getCourses().subscribe(data => {
      this.courses = data;
    });
  }

  // This function now correctly accepts a SimpleCourse object
  getCourseName(course: SimpleCourse): string {
    return course ? course.name : 'Unknown Course';
  }

  onSessionChange(event: Event): void {
    const entryId = (event.target as HTMLSelectElement).value;
    const selectedEntry = this.timetableEntries.find(entry => entry.id === +entryId);

    if (selectedEntry) {
      // Find the full course object from our courses list to get the students
      const fullCourse = this.courses.find(c => c.id === selectedEntry.course.id);
      this.studentsForSession = fullCourse ? fullCourse.students : [];
    } else {
      this.studentsForSession = [];
    }

    // The rest of this function is unchanged
    const studentControls = this.studentsForSession.map(student => 
      this.fb.group({
        student: [student.id],
        status: ['PRESENT', Validators.required]
      })
    );
    this.attendanceForm.setControl('studentAttendance', this.fb.array(studentControls));
  }

  onSubmit(): void {
    if (this.attendanceForm.invalid) return;

    const formValue = this.attendanceForm.value;
    formValue.studentAttendance.forEach((att: any) => {
      const attendanceData = {
        timetable_entry: formValue.timetable_entry,
        student: att.student,
        date: formValue.date,
        status: att.status
      };

      this.apiService.markAttendance(attendanceData).subscribe({
        next: () => console.log(`Attendance marked for student ${att.student}`),
        error: (err) => console.error(`Failed to mark attendance for student ${att.student}`, err)
      });
    });
    alert('Attendance has been submitted!');
  }
}