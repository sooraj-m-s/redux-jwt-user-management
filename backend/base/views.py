from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializer import UserSerializer, UserRegistrationSerializer, ProfileUpdateSerializer, AdminUserSerializer
from django.db.models import Q


# Create your views here.


# Custom JWT token login
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens['access']
            refresh_token = tokens['refresh']
            res = Response({'success': True})
            res.set_cookie(key='access_token', value=access_token, httponly=True, secure=False, samesite='Lax')  # Secure=False for local dev
            res.set_cookie(key='refresh_token', value=refresh_token, httponly=True, secure=False, samesite='Lax')
            return res
        except:
            return Response({'success': False}, status=status.HTTP_400_BAD_REQUEST)


# Custom token refresh
class CustomRefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            request.data['refresh'] = refresh_token
            response = super().post(request, *args, **kwargs)
            access_token = response.data['access']
            res = Response({'refreshed': True})
            res.set_cookie(key='access_token', value=access_token, httponly=True, secure=False, samesite='Lax')
            return res
        except:
            return Response({'refreshed': False}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout(request):
    res = Response({'success': True})
    res.delete_cookie('access_token', samesite='Lax')
    res.delete_cookie('refresh_token', samesite='Lax')
    return res


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    return Response({'authenticated': True})


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        serializer = ProfileUpdateSerializer(data=request.data)
        if serializer.is_valid():
            updated_user = serializer.update(user, serializer.validated_data)
            return Response(UserSerializer(updated_user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        search_query = request.query_params.get('search', None)
        users = User.objects.all()
        if search_query:
            users = users.filter(Q(username__icontains=search_query) | Q(email__icontains=search_query))
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


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

    def get(self, request, id):
        user = get_object_or_404(User, id=id)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, id):
        user = get_object_or_404(User, id=id)
        serializer = AdminUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        user = get_object_or_404(User, id=id)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
