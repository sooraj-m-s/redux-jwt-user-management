from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from base.models import Users
from .serializer import AdminDashboardSerializer, UpdateUserSerializer
from base.serializer import UserRegistrationSerializer
from .permissions import IsSuperUser


# Create your views here.


@permission_classes([AllowAny])
class AdminLogin(APIView):
    def post(self, request):
        email = request.data.get('email', '')
        password = request.data.get('password', '')
        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)
        if not user:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
        elif user.is_superuser:
            refresh = RefreshToken.for_user(user)
            res = Response(
                {
                    'message': 'Login successful',
                    'email': user.email,
                    'profile_image': user.profile_image,
                    'isAdmin': user.is_superuser
                },
                status=status.HTTP_200_OK
            )
            res.set_cookie('access_token', str(refresh.access_token), httponly=True, secure=True, samesite='Lax')
            res.set_cookie('refresh_token', str(refresh), httponly=True, secure=True, samesite='Lax')
            return res
        elif not user.is_superuser:
            return Response({'error': 'You are not authorized to access this page'}, status=status.HTTP_401_UNAUTHORIZED)


@permission_classes([IsSuperUser])
class AdminDashboard(APIView):
    def get(self, request):
        users = Users.objects.filter(is_superuser=False, status='Active')
        admin_serializer = AdminDashboardSerializer(request.user)
        users_serializer = AdminDashboardSerializer(users, many=True)
        return Response({'admin': admin_serializer.data, 'users': users_serializer.data}, status=status.HTTP_200_OK)


@permission_classes([IsSuperUser])
class CreateUser(APIView):
    def post(self, request):
        password = request.data.get('password', '')
        email = request.data.get('email', '')
        if len(password) < 8 or " " in password:
            return Response({'error': 'Password must be at least 8 characters and cannot contain spaces'}, status=status.HTTP_400_BAD_REQUEST)
        if Users.objects.filter(email=email).exists():
            return Response({'error': 'Email already registered'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsSuperUser])
class EditUserView(APIView):
    def patch(self, request, user_id):
        try:
            user = Users.objects.get(user_id=user_id)
        except Users.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
