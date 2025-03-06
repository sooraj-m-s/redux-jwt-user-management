from django.urls import path
from .views import AdminLogin, AdminDashboard

urlpatterns = [
    path('login/', AdminLogin.as_view(), name='admin_login'),
    path('dashboard/', AdminDashboard.as_view(), name='admin_dashboard'),
]
