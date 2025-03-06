from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


# Create your models here.


class UsersManager(BaseUserManager):
    pass


class Users(AbstractBaseUser, BaseUserManager):
    STATUS_CHOICE = [
        ('Active', 'Active'), ('Blocked', 'Blocked')
    ]

    user_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=30)
    email = models.EmailField(max_length=120, unique=True)
    password = models.CharField(max_length=120)
    profile_image = models.URLField(max_length=255)
    status = models.CharField(max_length=10, choices=STATUS_CHOICE, default='Active')
    created_at = models.DateField(auto_now_add=True)
    is_superuser = models.BooleanField(default=False)

    objects = UsersManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email
