from rest_framework import serializers
from base.models import Users


class AdminDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['user_id', 'first_name', 'email', 'profile_image', 'status']


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['first_name', 'email', 'profile_image', 'status']
