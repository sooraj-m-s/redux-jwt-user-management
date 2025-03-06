from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    Login, Logout,
    Register, UserProfileView, UserListView, UserCreateView, UserDetailView
)

urlpatterns = [
    path('login/', Login.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', Logout.as_view(), name='logout'),
    path('register/', Register.as_view(), name='register'),

    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('users/', UserListView.as_view(), name='user_list'),
    path('users/create/', UserCreateView.as_view(), name='user_create'),
    path('users/<int:id>/', UserDetailView.as_view(), name='user_detail'),
]
