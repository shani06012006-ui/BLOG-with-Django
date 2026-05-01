from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Blog

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class BlogSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    author_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Blog
        fields = ['id', 'title', 'body', 'author', 'author_id', 'created_at', 'updated_at']
