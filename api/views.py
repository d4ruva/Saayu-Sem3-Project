from django.shortcuts import render

from django.http import HttpResponse

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Mobile
from .serializers import MobileSeliazer

# Create your views here.
# TODO: IMPLEMENT TO GET SPECEFIC NUMBER OF PHONES
@api_view(['GET', 'POST'])
def mobile_list(request):
    if request.method == "GET":
        mobiles = Mobile.objects.all()
        # Filtering
        brand = request.GET.get('brand')
        min_price = request.GET.get('min_price')
        max_price = request.GET.get('max_price')
        ram = request.GET.get('ram')
        storage = request.GET.get('storage')
        if brand:
            mobiles = mobiles.filter(brand__iexact=brand)
        if min_price:
            mobiles = mobiles.filter(price__gte=min_price)
        if max_price:
            mobiles = mobiles.filter(price__lte=max_price)
        if ram:
            mobiles = mobiles.filter(ram=ram)
        if storage:
            mobiles = mobiles.filter(storage=storage)
        # Sorting
        sort = request.GET.get('sort')
        if sort == 'price_asc':
            mobiles = mobiles.order_by('price')
        elif sort == 'price_desc':
            mobiles = mobiles.order_by('-price')
        serializer = MobileSeliazer(mobiles, many=True)
        return Response(serializer.data)
    
    elif request.method == "POST":
        serializer  = MobileSeliazer(data = request.data)
        if(serializer.is_valid()):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def mobile_list_limit(request, limit):
    if request.method == "GET":
        mobiles = Mobile.objects.all()[:limit]
        serializer = MobileSeliazer(mobiles, many=True)
        return Response(serializer.data)

@api_view(['GET', 'PUT', 'DELETE'])
def mobile_detail(request, pk):
    try:
        mobile = Mobile.objects.get(pk=pk)
    except Mobile.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == "GET":
        serializer = MobileSeliazer(mobile)
        return Response(serializer.data)
    
    elif request.method == "PUT":
        serializer = MobileSeliazer(mobile, data=request.data)
        if(serializer.is_valid()):
            serializer.save()
            return Response(serializer.data)    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request == "DELETE":
        mobile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

