from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import Login, Logout, Register, Dashboard


urlpatterns = [
    path('login/', Login.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', Logout.as_view(), name='logout'),
    path('register/', Register.as_view(), name='register'),
    path('dashboard/', Dashboard.as_view(), name='dashboard')
]
