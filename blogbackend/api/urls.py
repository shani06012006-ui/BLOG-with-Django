from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogViewSet, UserViewSet

router = DefaultRouter()
router.register('blogs', BlogViewSet, basename='blog')
router.register('users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
]
