from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializer import UserRegistrationSerializer, ProfileUpdateSerializer, AdminUserSerializer
from .models import Users


# Create your views here.


# Custom JWT token login
@permission_classes([AllowAny])
class Login(APIView):
    def post(self, request):
        email = request.data.get('email', '')
        password = request.data.get('password', '')
        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    'message': 'Login successful',
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'email': user.email,
                    'profile_image': user.profile_image,
                },
                status=status.HTTP_200_OK
            )
        else:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)


class Logout(APIView):
    def post(self, request):
        res = Response({'success': True})
        res.delete_cookie('access_token', samesite='Lax')
        res.delete_cookie('refresh_token', samesite='Lax')
        return res


@permission_classes([AllowAny])
class Register(APIView):
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


@permission_classes([IsAuthenticated])
class Dashboard(APIView):
    def get(self, request):
        user = request.user
        data = {
            'first_name': user.first_name,
            'profile_image': user.profile_image,
            'email': user.email
        }
        return Response(data, status=status.HTTP_200_OK)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    # def get(self, request):
    #     user = request.user
    #     serializer = UserSerializer(user)
    #     return Response(serializer.data)

    # def put(self, request):
    #     user = request.user
    #     serializer = ProfileUpdateSerializer(data=request.data)
    #     if serializer.is_valid():
    #         updated_user = serializer.update(user, serializer.validated_data)
    #         return Response(UserSerializer(updated_user).data)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(APIView):
    permission_classes = [IsAdminUser]

    # def get(self, request):
    #     search_query = request.query_params.get('search', None)
    #     users = Users.objects.all()
    #     if search_query:
    #         users = users.filter(Q(username__icontains=search_query) | Q(email__icontains=search_query))
    #     serializer = UserSerializer(users, many=True)
    #     return Response(serializer.data)


class UserCreateView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = AdminUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(APIView):
    permission_classes = [IsAdminUser]

    # def get(self, request, id):
    #     user = get_object_or_404(Users, id=id)
    #     serializer = UserSerializer(user)
    #     return Response(serializer.data)

    # def put(self, request, id):
    #     user = get_object_or_404(Users, id=id)
    #     serializer = AdminUserSerializer(user, data=request.data, partial=True)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def delete(self, request, id):
    #     user = get_object_or_404(Users, id=id)
    #     user.delete()
    #    return Response(status=status.HTTP_204_NO_CONTENT)
