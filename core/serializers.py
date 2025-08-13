from rest_framework import serializers
from .models import User, SchoolClass, Subject, Course, Assignment, Attendance, Timetable, Payroll, ServiceStatus, DailyNote, Query, Announcement, Invoice, Payment

# Define serializers that are used by other serializers first
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name']

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'code']

class SimpleCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name', 'code']

# Now define serializers that depend on the ones above
class CourseSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    students = UserSerializer(many=True, read_only=True)
    class Meta:
        model = Course
        fields = ['id', 'name', 'code', 'subject', 'teacher', 'students']

class SchoolClassSerializer(serializers.ModelSerializer):
    students = UserSerializer(many=True, read_only=True)
    courses = CourseSerializer(many=True, read_only=True)
    class_teacher = UserSerializer(read_only=True)
    class Meta:
        model = SchoolClass
        fields = ['id', 'name', 'section', 'class_teacher', 'students', 'courses']

class TimetableSerializer(serializers.ModelSerializer):
    course = SimpleCourseSerializer(read_only=True)
    class Meta:
        model = Timetable
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    timetable_entry = TimetableSerializer(read_only=True)
    class Meta:
        model = Attendance
        fields = '__all__'

# --- Other Serializers ---
class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'

class StudentCourseSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    class Meta:
        model = Course
        fields = ['name', 'code', 'subject']

class StudentAssignmentSerializer(serializers.ModelSerializer):
    course = SimpleCourseSerializer(read_only=True)
    class Meta:
        model = Assignment
        fields = ['title', 'due_date', 'course']

class DailyNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyNote
        fields = '__all__'

class DailyNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyNote
        fields = '__all__' # Both Teachers and Admins can use
        
class PayrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payroll
        fields = '__all__'

# Add this new serializer for the ServiceStatus model
class ServiceStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceStatus
        fields = '__all__'        
        

class QuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Query
        fields = '__all__'


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'