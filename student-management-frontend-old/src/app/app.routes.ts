import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Courses } from './pages/courses/courses';
import { CourseCreate } from './pages/course-create/course-create';

import { TimetableComponent } from './pages/timetable/timetable';
import { TimetableCreate } from './pages/timetable-create/timetable-create';
import { InvoiceList } from './pages/invoice-list/invoice-list';
import { InvoiceCreate } from './pages/invoice-create/invoice-create';
import { authGuard } from './guards/auth-guard';
import { AssignmentList } from './pages/assignment-list/assignment-list';
import { AssignmentCreate } from './pages/assignment-create/assignment-create';
import { MarkAttendance } from './pages/mark-attendance/mark-attendance';
import { CourseEdit } from './pages/course-edit/course-edit';
import { ParentDashboard } from './pages/parent-dashboard/parent-dashboard';
import { UserManagement } from './pages/user-management/user-management';
import { UserCreate } from './pages/user-create/user-create';
import { ClassList } from './pages/class-list/class-list';
import { ClassCreate } from './pages/class-create/class-create';
import { ClassDetail } from './pages/class-detail/class-detail';
import { SubjectList } from './pages/subject-list/subject-list';
import { SubjectCreate } from './pages/subject-create/subject-create';
import { PayrollComponent } from './pages/payroll/payroll'; 
import { StudentDashboard } from './pages/student-dashboard/student-dashboard';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { TeacherDashboard } from './pages/teacher-dashboard/teacher-dashboard';
import { MyAttendance } from './pages/my-attendance/my-attendance';
import { MyCourses } from './pages/my-courses/my-courses';
import { MyAssignments } from './pages/my-assignments/my-assignments';
import { MyGrades } from './pages/my-grades/my-grades';
import { MySubjects } from './pages/my-subjects/my-subjects';
import { NoteList } from './pages/note-list/note-list';
import { NoteCreate } from './pages/note-create/note-create';
import { MyNotes } from './pages/my-notes/my-notes';







export const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },

  // Protected routes that require login
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },
  {
    path: 'courses',
    component: Courses,
    canActivate: [authGuard]
  },
  {
    path: 'courses/create',
    component: CourseCreate,
    canActivate: [authGuard]
  },
  {
    path: 'timetable',
    component: TimetableComponent,
    canActivate: [authGuard]
  },
  {
    path: 'timetable/create',
    component: TimetableCreate,
    canActivate: [authGuard]
  },
  { path: 'assignments', component: AssignmentList, canActivate: [authGuard] },
  { path: 'assignments/create', component: AssignmentCreate, canActivate: [authGuard] },
  { path: 'attendance/mark', component: MarkAttendance, canActivate: [authGuard] },
  { path: 'courses/edit/:id', component: CourseEdit, canActivate: [authGuard] },
  { path: 'parent-dashboard', component: ParentDashboard, canActivate: [authGuard] },
  { path: 'user-management', component: UserManagement, canActivate: [authGuard] },
  { path: 'users/create', component: UserCreate, canActivate: [authGuard] },
  { path: 'classes', component: ClassList, canActivate: [authGuard] },
  { path: 'classes/create', component: ClassCreate, canActivate: [authGuard] },
  { path: 'classes/:id', component: ClassDetail, canActivate: [authGuard] },
  { path: 'subjects', component: SubjectList, canActivate: [authGuard] },
  { path: 'subjects/create', component: SubjectCreate, canActivate: [authGuard] },
  { path: 'payroll', component: PayrollComponent, canActivate: [authGuard] },
  { path: 'student-dashboard', component: StudentDashboard, canActivate: [authGuard] },
  { path: 'admin-dashboard', component: AdminDashboard, canActivate: [authGuard] },
  { path: 'teacher-dashboard', component: TeacherDashboard, canActivate: [authGuard] },
  { path: 'my-attendance', component: MyAttendance, canActivate: [authGuard] },
  { path: 'my-courses', component: MyCourses, canActivate: [authGuard] },
  { path: 'my-assignments', component: MyAssignments, canActivate: [authGuard] },
  { path: 'my-grades', component: MyGrades, canActivate: [authGuard] },
  { path: 'my-subjects', component: MySubjects, canActivate: [authGuard] },
  { path: 'notes', component: NoteList, canActivate: [authGuard] },
  { path: 'notes/create', component: NoteCreate, canActivate: [authGuard] },
  { path: 'my-notes', component: MyNotes, canActivate: [authGuard] },
  { path: 'invoices', component: InvoiceList, canActivate: [authGuard] },
  { path: 'invoices/create', component: InvoiceCreate, canActivate: [authGuard] },







];