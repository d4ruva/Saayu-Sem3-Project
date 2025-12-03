from rest_framework import serializers
from .models import Mobile


class MobileSeliazer(serializers.ModelSerializer):
    class Meta:
        model = Mobile
        fields = '__all__'