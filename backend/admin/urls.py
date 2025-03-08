from django.urls import path
from .views import AdminLogin, AdminDashboard, EditUserView


urlpatterns = [
    path('login/', AdminLogin.as_view(), name='admin_login'),
    path('dashboard/', AdminDashboard.as_view(), name='admin_dashboard'),
    path('edit/<int:user_id>/', EditUserView.as_view(), name='edit_user'),
]
