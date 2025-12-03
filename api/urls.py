from django.urls import path, include

from rest_framework.routers import DefaultRouter
from . import views

urlpatterns = [
    path('api/', views.mobile_list),
    path('api/<int:pk>/', views.mobile_detail),
    path('api/getMobiles/<int:limit>/', views.mobile_list_limit)
]
