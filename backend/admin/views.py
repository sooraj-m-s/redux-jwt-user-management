from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from base.models import Users
from .serializer import AdminDashboardSerializer
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
        if user.is_superuser:
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
        elif not user.is_superuser:
            return Response({'error': 'You are not authorized to access this page'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)


@permission_classes([IsSuperUser])
class AdminDashboard(APIView):
    def get(self, request):
        users = Users.objects.filter(is_superuser=False)
        serializer = AdminDashboardSerializer(users, many=True)
        return Response({'users': serializer.data}, status=status.HTTP_200_OK)
