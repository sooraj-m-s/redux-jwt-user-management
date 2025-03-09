from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializer import UserRegistrationSerializer, UserProfileUpdateSerializer
from .models import Users


# Create your views here.


@permission_classes([AllowAny])
class Login(APIView):
    def post(self, request):
        email = request.data.get('email', '')
        password = request.data.get('password', '')
        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_403_FORBIDDEN)

        user = authenticate(request, email=email, password=password)
        if user:
            if user.status == 'Blocked':
                return Response({'error': 'Your account has been blocked!'}, status=status.HTTP_401_UNAUTHORIZED)
            refresh = RefreshToken.for_user(user)
            res = Response(
                {
                    'message': 'Login successful',
                    'first_name': user.first_name,
                    'email': user.email,
                    'profile_image': user.profile_image
                },
                status=status.HTTP_200_OK
            )
            res.set_cookie('access_token', str(refresh.access_token), httponly=True, secure=True, samesite='Lax')
            res.set_cookie('refresh_token', str(refresh), httponly=True, secure=True, samesite='Lax')
            return res
        else:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)


class Logout(APIView):
    def post(self, request):
        res = Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
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
            'email': user.email,
            'isAdmin': user.is_superuser
        }
        return Response(data, status=status.HTTP_200_OK)

    def patch(self, request):
        user = request.user
        serializer = UserProfileUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
