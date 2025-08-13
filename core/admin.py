from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
# Make sure to import the new models
from .models import User, SchoolClass, Subject, Course, DailyNote, Assignment, Attendance, Timetable, Payroll, Query, ServiceStatus,Announcement, Invoice, Payment

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        # Add 'salary' to the fields an admin can edit
        ('Extra Fields', {'fields': ('role', 'school_class', 'salary', 'children')}),
    )
    list_display = ('username', 'email', 'role', 'school_class')

@admin.register(SchoolClass)
class SchoolClassAdmin(admin.ModelAdmin):
    list_display = ('name', 'section', 'class_teacher')
    filter_horizontal = ('courses',)

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')

@admin.register(DailyNote)
class DailyNoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'teacher', 'date')
    list_filter = ('course', 'teacher', 'date')


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'subject', 'teacher')
    list_filter = ('subject', 'teacher')
    search_fields = ('name', 'code')

@admin.register(Timetable)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ('course', 'day_of_week', 'start_time', 'end_time')
    list_filter = ('day_of_week', 'course')

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'due_date', 'grade')
    list_filter = ('course',)

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'timetable_entry', 'date', 'status')
    list_filter = ('date', 'status')

# Register the new Payroll model
@admin.register(Payroll)
class PayrollAdmin(admin.ModelAdmin):
    list_display = ('teacher', 'amount', 'pay_date', 'status')
    list_filter = ('status', 'pay_date')

# Register the new ServiceStatus model
@admin.register(ServiceStatus)
class ServiceStatusAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active')


@admin.register(Query)
class QueryAdmin(admin.ModelAdmin):
    list_display = ('student', 'teacher', 'course', 'asked_on', 'answered_on')
    list_filter = ('course', 'teacher')

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('title', 'target_audience', 'created_at')
    list_filter = ('target_audience',)


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('student', 'title', 'amount', 'due_date', 'status')
    list_filter = ('status', 'due_date')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('invoice', 'amount_paid', 'payment_date', 'payment_method')
    list_filter = ('payment_method',)