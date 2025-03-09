from django.urls import path
from .views import AdminLogin, AdminDashboard, CreateUser, EditUserView


urlpatterns = [
    path('login/', AdminLogin.as_view(), name='admin_login'),
    path('dashboard/', AdminDashboard.as_view(), name='admin_dashboard'),
    path('create-user/', CreateUser.as_view(), name='create_user'),
    path('edit-user/<int:user_id>/', EditUserView.as_view(), name='edit_user'),
]
