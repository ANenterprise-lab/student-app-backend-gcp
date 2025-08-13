from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .permissions import IsAdminUser
from .permissions import IsAdminUser, IsTeacherUser
from .models import Announcement
from .serializers import AnnouncementSerializer
from .models import User, SchoolClass, Subject, Course, Assignment, Attendance, Timetable, Payroll ,DailyNote , ServiceStatus
from .models import Query, Invoice, Payment
from .serializers import (
    UserSerializer,
    UserCreateSerializer,
    CourseSerializer,
    AssignmentSerializer,
    AttendanceSerializer,
    TimetableSerializer,
    SchoolClassSerializer,
    SubjectSerializer,
    StudentCourseSerializer,  # Added import
    StudentAssignmentSerializer,  # Also needed below
    PayrollSerializer,
    ServiceStatusSerializer,
    DailyNoteSerializer,
    QuerySerializer,
    InvoiceSerializer,
    PaymentSerializer
)
class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAdminUser] 
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return UserCreateSerializer
        return UserSerializer

class CourseListCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAdminUser] 

class AssignmentListCreateView(generics.ListCreateAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAdminUser] 

class AttendanceListCreateView(generics.ListCreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAdminUser] 

class TimetableListCreateView(generics.ListCreateAPIView):
    queryset = Timetable.objects.all()
    serializer_class = TimetableSerializer
    permission_classes = [IsAdminUser] 

class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAdminUser] 

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser] 

class ParentDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Ensure the user has the 'PARENT' role
        if request.user.role != 'PARENT':
            return Response(
                {'error': 'You do not have permission to view this page.'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get the logged-in parent user
        parent = request.user

        # Get all children linked to this parent
        children = parent.children.all()

        # Use our existing UserSerializer to convert child data to JSON
        children_serializer = UserSerializer(children, many=True)

        dashboard_data = {
            "message": f"Welcome, {parent.first_name or parent.username}!",
            "children": children_serializer.data # Use the real, serialized child data
        }

        return Response(dashboard_data, status=status.HTTP_200_OK)

# Add the missing MeView class here
class MeView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    

# Add this new view for handling school classes
class SchoolClassListCreateView(generics.ListCreateAPIView):
    queryset = SchoolClass.objects.all()
    serializer_class = SchoolClassSerializer
    permission_classes = [IsAdminUser] # Only Admins can manage classes

# Add this new view for handling a single school class
class SchoolClassDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SchoolClass.objects.all()
    serializer_class = SchoolClassSerializer
    permission_classes = [IsAdminUser]

class SubjectListCreateView(generics.ListCreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAdminUser]


class StudentDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        student = request.user
        if student.role != 'STUDENT':
            return Response({'error': 'Only students can access this page.'}, status=status.HTTP_403_FORBIDDEN)

        # Get the student's enrolled courses and upcoming assignments
        enrolled_courses = student.enrolled_courses.all()
        upcoming_assignments = Assignment.objects.filter(course__in=enrolled_courses).order_by('due_date')[:5]

        dashboard_data = {
            "courses": StudentCourseSerializer(enrolled_courses, many=True).data,
            "assignments": StudentAssignmentSerializer(upcoming_assignments, many=True).data,
            # We will add attendance data here in a future step
        }
        return Response(dashboard_data)
    
class PayrollListCreateView(generics.ListCreateAPIView):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer
    permission_classes = [IsAdminUser]

# Add this new view for the owner's service switch
class ServiceStatusView(generics.ListAPIView):
    queryset = ServiceStatus.objects.all()
    serializer_class = ServiceStatusSerializer
    permission_classes = [IsAdminUser]

class TeacherDashboardView(APIView):
    permission_classes = [IsTeacherUser] # Protect this view for teachers only

    def get(self, request, *args, **kwargs):
        teacher = request.user
        dashboard_data = {
            "message": f"Welcome, Teacher {teacher.first_name or teacher.username}!",
            # In the future, we will add lists of assigned classes,
            # student queries, and notifications here.
        }
        return Response(dashboard_data, status=status.HTTP_200_OK)

class StudentAttendanceView(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # This line ensures that the user only sees their own attendance records
        return Attendance.objects.filter(student=self.request.user)

class StudentNotesView(generics.ListAPIView):
    serializer_class = DailyNoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the currently logged-in user
        user = self.request.user
        # Get all courses the user is enrolled in
        enrolled_courses = user.enrolled_courses.all()
        # Filter notes to only those that belong to the enrolled courses
        return DailyNote.objects.filter(course__in=enrolled_courses).order_by('-date')

class StudentCoursesView(generics.ListAPIView):
    serializer_class = CourseSerializer # We can reuse our existing CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # This line ensures that the user only sees the courses they are enrolled in
        return self.request.user.enrolled_courses.all()

class StudentAssignmentsView(generics.ListAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the currently logged-in user
        user = self.request.user
        # Get all courses the user is enrolled in
        enrolled_courses = user.enrolled_courses.all()
        # Filter assignments to only those that belong to the enrolled courses
        return Assignment.objects.filter(course__in=enrolled_courses).order_by('due_date')

class DailyNoteListCreateView(generics.ListCreateAPIView):
    queryset = DailyNote.objects.all()
    serializer_class = DailyNoteSerializer
    permission_classes = [IsAuthenticated]

class QueryListCreateView(generics.ListCreateAPIView):
    queryset = Query.objects.all()
    serializer_class = QuerySerializer
    permission_classes = [IsAuthenticated] # Allow any authenticated user to create/view queries

class AnnouncementListCreateView(generics.ListCreateAPIView):
    queryset = Announcement.objects.all().order_by('-created_at')
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticated]

class InvoiceListCreateView(generics.ListCreateAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAdminUser] # Only Admins can manage invoices

# Add this new view for handling payments
class PaymentListCreateView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]


@api_view(['POST'])
def login_view(request):
    # This view is now obsolete but we'll leave it for now
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user is not None:
        return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)