from django.urls import path
from .views import (
    CustomTokenObtainPairView, CustomRefreshTokenView, logout, is_authenticated,
    register, UserProfileView, UserListView, UserCreateView, UserDetailView
)

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomRefreshTokenView.as_view(), name='token_refresh'),
    path('logout/', logout, name='logout'),
    path('authenticated/', is_authenticated, name='authenticated'),
    path('register/', register, name='register'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('users/', UserListView.as_view(), name='user_list'),
    path('users/create/', UserCreateView.as_view(), name='user_create'),
    path('users/<int:id>/', UserDetailView.as_view(), name='user_detail'),
]
