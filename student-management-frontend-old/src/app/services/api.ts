import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}
export interface Course {
  id: number;
  name: string;
  code: string;
  subject: Subject;
  teacher: number;
  students: User[];
  credit_hours: number; 
    description: string | null; 
}
export interface SimpleCourse {
  id: number;
  name: string;
  code: string;
}
export interface Timetable {
  id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  room_number: string;
  course: SimpleCourse; // Now a nested SimpleCourse object
}
export interface Assignment {
  id: number;
  title: string;
  description: string;
  due_date: string;
  course: number;
  grade: string | null;
}
export interface SchoolClass {
  id: number;
  name: string;
  section: string;
  class_teacher: User | null; // Now a nested User object
  students: User[];
  courses: Course[]; // Now an array of nested Course objects
}
export interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  syllabus: string;
  completion_percentage: number;
}
export interface Payroll {
  id: number;
  teacher: number;
  amount: string; // The backend sends decimal as a string
  pay_date: string;
  status: string;
}
export interface Attendance {
  id: number;
  student: User;
  timetable_entry: Timetable; // Uses the corrected Timetable interface
  date: string;
  status: string;
}
export interface DailyNote {
  id: number;
  title: string;
  content: string;
  date: string;
  course: number;
  teacher: number;
}
export interface Invoice {
  id: number;
  student: number;
  title: string;
  amount: string; // The backend sends decimal as a string
  due_date: string;
  status: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class Api {
  private apiUrl = 'http://localhost:8000/api';
  private token: string | null = null;
  private isBrowser: boolean;
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());
  // Add this property to store the current user
  public currentUser = new BehaviorSubject<User | null>(null);
  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private http: HttpClient
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    // Load the token from localStorage when the service is created
    if (this.isBrowser) {
      this.token = localStorage.getItem('authToken');
      this.authStatus.next(this.hasToken()); // Ensure status is updated on creation
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  private hasToken(): boolean {
    if (this.isBrowser) {
      return !!localStorage.getItem('authToken');
    }
    return false;
  }

  login(credentials: any): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/token/`, credentials).pipe(
      tap(response => {
        this.setToken(response.access);
        this.authStatus.next(true);
        // After logging in, fetch the user's own details
        this.getMe(); 
      })
    );
  }

  logout(): void {
    this.token = null;
    if (this.isBrowser) {
      localStorage.removeItem('authToken');
    }
    this.authStatus.next(false);
    this.currentUser.next(null); // Clear the user on logout
  }
    // Add this new function to get school classes
  getClasses(): Observable<SchoolClass[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<SchoolClass[]>(`${this.apiUrl}/classes/`, { headers });
  }

  // Add this new function to create a school class
  createClass(classData: any): Observable<SchoolClass> {
    const headers = this.getAuthHeaders();
    return this.http.post<SchoolClass>(`${this.apiUrl}/classes/`, classData, { headers });
  }

  getClass(id: number): Observable<SchoolClass> {
  const headers = this.getAuthHeaders();
  return this.http.get<SchoolClass>(`${this.apiUrl}/classes/${id}/`, { headers });
}

  getMe(): void {
    const headers = this.getAuthHeaders();
    this.http.get<User>(`${this.apiUrl}/users/me/`, { headers }).subscribe(user => {
      this.currentUser.next(user);
    });
  }

  setToken(token: string) {
    this.token = token;
    if (this.isBrowser) {
      localStorage.setItem('authToken', token);
    }
  }

createUser(userData: any): Observable<User> {
  const headers = this.getAuthHeaders();
  return this.http.post<User>(`${this.apiUrl}/users/`, userData, { headers });
}

  getUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(`${this.apiUrl}/users/`, { headers });
  }

updateUserRole(userId: number, role: string): Observable<User> {
  const headers = this.getAuthHeaders();
  // We use PATCH to only update the role field
  return this.http.patch<User>(`${this.apiUrl}/users/${userId}/`, { role: role }, { headers });
}

  getCourses(): Observable<Course[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Course[]>(`${this.apiUrl}/courses/`, { headers });
  }

  createCourse(courseData: any): Observable<Course> {
  const headers = this.getAuthHeaders();
  return this.http.post<Course>(`${this.apiUrl}/courses/`, courseData, { headers });
}
getCourse(id: number): Observable<Course> {
  const headers = this.getAuthHeaders();
  return this.http.get<Course>(`${this.apiUrl}/courses/${id}/`, { headers });
}

updateCourse(id: number, courseData: any): Observable<Course> {
  const headers = this.getAuthHeaders();
  return this.http.put<Course>(`${this.apiUrl}/courses/${id}/`, courseData, { headers });
}

deleteCourse(id: number): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.delete(`${this.apiUrl}/courses/${id}/`, { headers });
}

getTimetables(): Observable<Timetable[]> {
  const headers = this.getAuthHeaders();
  // Ensure this URL is singular to match the backend
  return this.http.get<Timetable[]>(`${this.apiUrl}/timetable/`, { headers });
}

createTimetableEntry(entryData: any): Observable<Timetable> {
  const headers = this.getAuthHeaders();
  return this.http.post<Timetable>(`${this.apiUrl}/timetable/`, entryData, { headers });
}
  getAssignments(): Observable<Assignment[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Assignment[]>(`${this.apiUrl}/assignments/`, { headers });
  }

    createAssignment(assignmentData: any): Observable<Assignment> {
    const headers = this.getAuthHeaders();
    return this.http.post<Assignment>(`${this.apiUrl}/assignments/`, assignmentData, { headers });
  }
  getParentDashboard(): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.get(`${this.apiUrl}/parent-dashboard/`, { headers });
}
  getSubjects(): Observable<Subject[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Subject[]>(`${this.apiUrl}/subjects/`, { headers });
  }
  getPayrolls(): Observable<Payroll[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Payroll[]>(`${this.apiUrl}/payroll/`, { headers });
  }

  createSubject(subjectData: any): Observable<Subject> {
    const headers = this.getAuthHeaders();
    return this.http.post<Subject>(`${this.apiUrl}/subjects/`, subjectData, { headers });
  }
  createPayroll(payrollData: any): Observable<Payroll> {
    const headers = this.getAuthHeaders();
    return this.http.post<Payroll>(`${this.apiUrl}/payroll/`, payrollData, { headers });
  }
markAttendance(attendanceData: any): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.post(`${this.apiUrl}/attendance/`, attendanceData, { headers });
}
getTeacherDashboard(): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.get(`${this.apiUrl}/teacher-dashboard/`, { headers });
}
getMyAttendance(): Observable<Attendance[]> {
  const headers = this.getAuthHeaders();
  return this.http.get<Attendance[]>(`${this.apiUrl}/my-attendance/`, { headers });
}

getStudentDashboard(): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.get(`${this.apiUrl}/student-dashboard/`, { headers });
}

getMyCourses(): Observable<Course[]> {
  const headers = this.getAuthHeaders();
  return this.http.get<Course[]>(`${this.apiUrl}/my-courses/`, { headers });
}
getMyAssignments(): Observable<Assignment[]> {
  const headers = this.getAuthHeaders();
  return this.http.get<Assignment[]>(`${this.apiUrl}/my-assignments/`, { headers });
}
  getNotes(): Observable<DailyNote[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<DailyNote[]>(`${this.apiUrl}/notes/`, { headers });
  }

  createNote(noteData: any): Observable<DailyNote> {
    const headers = this.getAuthHeaders();
    return this.http.post<DailyNote>(`${this.apiUrl}/notes/`, noteData, { headers });
  }
getMyNotes(): Observable<DailyNote[]> {
  const headers = this.getAuthHeaders();
  return this.http.get<DailyNote[]>(`${this.apiUrl}/my-notes/`, { headers });
}
  getInvoices(): Observable<Invoice[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Invoice[]>(`${this.apiUrl}/invoices/`, { headers });
  }

  createInvoice(invoiceData: any): Observable<Invoice> {
    const headers = this.getAuthHeaders();
    return this.http.post<Invoice>(`${this.apiUrl}/invoices/`, invoiceData, { headers });
  }





  getAttendance(): Observable<Attendance[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Attendance[]>(`${this.apiUrl}/attendance/`, { headers });
  }
  private getAuthHeaders(): HttpHeaders {
    if (this.isBrowser && !this.token) {
      this.token = localStorage.getItem('authToken');
    }
    if (this.token) {
      return new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    }
    return new HttpHeaders();
  }
}