from rest_framework import serializers
from .models import Users


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model=Users
        fields=['first_name', 'email', 'password', 'profile_image']

    def create(self, validated_data):
        user = Users(
            first_name=validated_data['first_name'],
            email=validated_data['email'],
            profile_image=validated_data['profile_image']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['first_name', 'profile_image', 'email']
