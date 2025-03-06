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


class ProfileUpdateSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    profile_image = serializers.ImageField(required=False)

    def update(self, user, validated_data):
        user.username = validated_data.get('username', user.username)
        user.email = validated_data.get('email', user.email)
        user.save()
        profile = user.profile
        if 'profile_image' in validated_data:
            profile.profile_image = validated_data['profile_image']
            profile.save()
        return user


class AdminUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Users
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = Users.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
