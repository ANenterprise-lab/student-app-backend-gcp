from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
import decimal


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        TEACHER = "TEACHER", "Teacher"
        STUDENT = "STUDENT", "Student"
        PARENT = "PARENT", "Parent"

    role = models.CharField(max_length=50, choices=Role.choices)
    salary = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        validators=[MinValueValidator(decimal.Decimal('0.00'))]
    )
    children = models.ManyToManyField(
        'self', symmetrical=False, blank=True, related_name='parents',
        limit_choices_to={'role': Role.STUDENT}
    )
    school_class = models.ForeignKey(
        'SchoolClass', on_delete=models.SET_NULL, null=True,
        blank=True, related_name='students'
    )

class SchoolClass(models.Model):
    name = models.CharField(max_length=100)
    section = models.CharField(max_length=20)
    class_teacher = models.ForeignKey(
        'User', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='class_teacher_of', limit_choices_to={'role': User.Role.TEACHER}
    )
    courses = models.ManyToManyField('Course', blank=True, related_name='classes')
    def __str__(self):
        return f"{self.name} - Section {self.section}"
    
# New model for Subjects
class Subject(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True, null=True)
    syllabus = models.TextField(blank=True, null=True)
    completion_percentage = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    def __str__(self):
        return self.name

class DailyNote(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    date = models.DateField(auto_now_add=True)
    # Link the note to a specific course and the teacher who created it
    course = models.ForeignKey('Course', on_delete=models.CASCADE, related_name='notes')
    teacher = models.ForeignKey('User', on_delete=models.CASCADE, related_name='notes', limit_choices_to={'role': User.Role.TEACHER})

    def __str__(self):
        return f"{self.title} for {self.course.code} on {self.date}"


class Course(models.Model):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True, null=True)
    credit_hours = models.PositiveIntegerField()
    subject = models.ForeignKey(
        'Subject', on_delete=models.CASCADE, related_name='courses', null=True, blank=True
    )
    teacher = models.ForeignKey(
        'User', on_delete=models.SET_NULL, null=True,
        limit_choices_to={'role': User.Role.TEACHER}
    )
    students = models.ManyToManyField(
        'User', related_name='enrolled_courses', blank=True,
        limit_choices_to={'role': User.Role.STUDENT}
    )
    def __str__(self):
        return f"{self.code} - {self.name}"

# --- Timetable Model (Moved Before Attendance) ---
class Timetable(models.Model):
    class DayOfWeek(models.TextChoices):
        MONDAY = "MONDAY", "Monday"
        TUESDAY = "TUESDAY", "Tuesday"
        WEDNESDAY = "WEDNESDAY", "Wednesday"
        THURSDAY = "THURSDAY", "Thursday"
        FRIDAY = "FRIDAY", "Friday"
        SATURDAY = "SATURDAY", "Saturday"
        SUNDAY = "SUNDAY", "Sunday"
    course = models.ForeignKey('Course', on_delete=models.CASCADE)
    day_of_week = models.CharField(max_length=10, choices=DayOfWeek.choices)
    start_time = models.TimeField()
    end_time = models.TimeField()
    room_number = models.CharField(max_length=20, blank=True)
    class Meta:
        unique_together = ('day_of_week', 'start_time', 'end_time', 'room_number')
    def __str__(self):
        return f"{self.course.name} - {self.day_of_week} ({self.start_time} - {self.end_time})"

class Assignment(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    due_date = models.DateTimeField()
    course = models.ForeignKey('Course', on_delete=models.CASCADE)
    grade = models.CharField(max_length=5, blank=True, null=True) # e.g., "A+", "85%", "Pass"
    def __str__(self):
        return self.title

# --- Attendance Model (Now correctly placed after Timetable) ---
class Attendance(models.Model):
    class StatusChoices(models.TextChoices):
        PRESENT = "PRESENT", "Present"
        ABSENT = "ABSENT", "Absent"
        LATE = "LATE", "Late"
    timetable_entry = models.ForeignKey('Timetable', on_delete=models.CASCADE)
    student = models.ForeignKey('User', on_delete=models.CASCADE, limit_choices_to={'role': User.Role.STUDENT})
    date = models.DateField()
    status = models.CharField(max_length=10, choices=StatusChoices.choices)
    class Meta:
        unique_together = ('timetable_entry', 'student', 'date')
    def __str__(self):
        return f"{self.student.username} - {self.timetable_entry} on {self.date}"
    
    # New model for HR Payroll feature
class Payroll(models.Model):
    class PayStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        PAID = "PAID", "Paid"
        FAILED = "FAILED", "Failed"

    teacher = models.ForeignKey(
        'User', on_delete=models.CASCADE, limit_choices_to={'role': User.Role.TEACHER}
    )
    amount = models.DecimalField(
        max_digits=10, decimal_places=2,
        validators=[MinValueValidator(decimal.Decimal('0.01'))]
    )
    pay_date = models.DateField()
    status = models.CharField(max_length=10, choices=PayStatus.choices, default=PayStatus.PENDING)

    def __str__(self):
        return f"Payment for {self.teacher.username} on {self.pay_date}"

# New model for the Owner's Security Switch
class ServiceStatus(models.Model):
    name = models.CharField(max_length=100, default="Main Application Service")
    is_active = models.BooleanField(default=True)
    def __str__(self):
        return "Main Application Service Status"
    
    # New model for the HR Payroll feature
class Payroll(models.Model):
    class PayStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        PAID = "PAID", "Paid"
        FAILED = "FAILED", "Failed"

    teacher = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': User.Role.TEACHER}
    )
    amount = models.DecimalField(
        max_digits=10, decimal_places=2,
        validators=[MinValueValidator(decimal.Decimal('0.01'))]
    )
    pay_date = models.DateField()
    status = models.CharField(max_length=10, choices=PayStatus.choices, default=PayStatus.PENDING)

    def __str__(self):
        return f"Payment for {self.teacher.username} on {self.pay_date}"

class Query(models.Model):
    student = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='queries_asked',
        limit_choices_to={'role': User.Role.STUDENT}
    )
    teacher = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='queries_to_answer',
        limit_choices_to={'role': User.Role.TEACHER}
    )
    course = models.ForeignKey('Course', on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.TextField(blank=True, null=True)
    asked_on = models.DateTimeField(auto_now_add=True)
    answered_on = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Query from {self.student.username} for {self.course.code}"

class Announcement(models.Model):
    class Audience(models.TextChoices):
        ALL = "ALL", "All Users"
        STUDENTS = "STUDENTS", "All Students"
        TEACHERS = "TEACHERS", "All Teachers"
        PARENTS = "PARENTS", "All Parents"

    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    target_audience = models.CharField(max_length=10, choices=Audience.choices, default=Audience.ALL)

    def __str__(self):
        return self.title
    

# New model for the Owner's Security Switch
class ServiceStatus(models.Model):
    name = models.CharField(max_length=100, default="Main Application Service")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return "Main Application Service Status"
    
class Invoice(models.Model):
    class InvoiceStatus(models.TextChoices):
        UNPAID = "UNPAID", "Unpaid"
        PAID = "PAID", "Paid"
        CANCELLED = "CANCELLED", "Cancelled"

    student = models.ForeignKey('User', on_delete=models.CASCADE, related_name='invoices', limit_choices_to={'role': User.Role.STUDENT})
    title = models.CharField(max_length=255) # e.g., "September Tuition Fee"
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    status = models.CharField(max_length=10, choices=InvoiceStatus.choices, default=InvoiceStatus.UNPAID)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Invoice for {self.student.username} - {self.title}"

class Payment(models.Model):
    class PaymentMethod(models.TextChoices):
        CARD = "CARD", "Card"
        BANK = "BANK", "Bank Transfer"
        CASH = "CASH", "Cash"

    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=15, choices=PaymentMethod.choices)
    transaction_id = models.CharField(max_length=255, blank=True, null=True) # For online payments

    def __str__(self):
        return f"Payment of {self.amount_paid} for {self.invoice.title}"