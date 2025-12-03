from django.urls import path, include

from rest_framework.routers import DefaultRouter
from . import views

urlpatterns = [
    path('api/mobiles/', views.mobile_list),
    path('api/<int:pk>/', views.mobile_detail),
    path('api/getMobiles/<int:limit>/', views.mobile_list_limit),

    # live search (external image/price)
    path('api/live/', views.api_live),
    path('api/live_batch/', views.api_live_batch),

    # compare and preferences
    path('api/compare/', views.api_compare),
    path('api/preferences/', views.api_preferences),

    # simple demo auth + favorites
    path('api/login/', views.api_login),
    path('api/me/', views.api_me),
    path('api/toggle_like/', views.api_toggle_like),
    path('api/favorites/', views.api_favorites),
]
