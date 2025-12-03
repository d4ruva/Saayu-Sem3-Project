import os
import time
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from django.shortcuts import render

from django.http import HttpResponse

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Mobile
from .serializers import MobileSeliazer

# Simple in-memory favorites store for demo purposes
FAVORITES = {}

# External live search config (SERPAPI by default)
SEARCH_PROVIDER = os.getenv("SEARCH_PROVIDER", "serpapi")
SERPAPI_KEY = os.getenv("SERPAPI_KEY", "")
GOOGLE_KEY = os.getenv("GOOGLE_KEY", "")
GOOGLE_CX = os.getenv("GOOGLE_CX", "")
MAX_WORKERS = int(os.getenv("LIVE_MAX_WORKERS", "6"))


def fetch_live_for_query(q):
    q = (q or "").strip()
    if not q:
        return {}
    if SEARCH_PROVIDER == "google":
        if not GOOGLE_KEY or not GOOGLE_CX:
            return {}
        try:
            params = {"key": GOOGLE_KEY, "cx": GOOGLE_CX, "q": q, "num": 3}
            r = requests.get("https://www.googleapis.com/customsearch/v1", params=params, timeout=10)
            r.raise_for_status()
            data = r.json()
            items = data.get("items") or []
            first = items[0] if items else {}
            image = None
            link = first.get("link")
            snippet = first.get("snippet")
            if first.get("pagemap") and first["pagemap"].get("cse_image"):
                image = first["pagemap"]["cse_image"][0].get("src")
            return {"image": image, "price": None, "link": link, "source": "google", "snippet": snippet, "ts": time.time()}
        except Exception:
            return {}

    # default: serpapi
    if SEARCH_PROVIDER == "serpapi":
        if not SERPAPI_KEY:
            return {}
        try:
            params = {"engine": "google_shopping", "q": q, "api_key": SERPAPI_KEY, "gl": "in", "num": 5}
            r = requests.get("https://serpapi.com/search", params=params, timeout=12)
            r.raise_for_status()
            data = r.json()
            image = None
            price = None
            link = None
            if data.get("shopping_results"):
                for item in data["shopping_results"]:
                    if not image and item.get("thumbnail"):
                        image = item.get("thumbnail")
                    if not price and item.get("price"):
                        price = item.get("price")
                    if not link and item.get("link"):
                        link = item.get("link")
                return {"image": image, "price": price, "link": link, "source": "serpapi", "ts": time.time()}
            return {}
        except Exception:
            return {}
    return {}


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

    elif request.method == "DELETE":
        mobile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def api_live(request):
    q = request.GET.get('q', '').strip()
    if not q:
        return Response({}, status=400)
    try:
        r = fetch_live_for_query(q)
        return Response(r)
    except Exception:
        return Response({}, status=500)


@api_view(['POST', 'OPTIONS'])
def api_live_batch(request):
    if request.method == 'OPTIONS':
        return Response({}, status=200)
    body = request.data or {}
    queries = body.get('queries') or []
    if not queries:
        return Response({}, status=400)
    out = {}
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
        future_map = {ex.submit(fetch_live_for_query, q): q for q in queries}
        for f in as_completed(future_map):
            q = future_map[f]
            try:
                res = f.result()
            except Exception:
                res = {}
            out[q] = res or {}
    return Response(out)


@api_view(['GET'])
def api_compare(request):
    m1 = request.GET.get('m1', '').strip()
    m2 = request.GET.get('m2', '').strip()
    if not m1 or not m2:
        return Response({'error': 'm1 and m2 required'}, status=400)
    try:
        phone1 = Mobile.objects.filter(model__iexact=m1).first()
        phone2 = Mobile.objects.filter(model__iexact=m2).first()
    except Exception:
        return Response({'error': 'db_error'}, status=500)
    if not phone1 or not phone2:
        return Response({'error': 'not_found', 'phone1': phone1 and MobileSeliazer(phone1).data, 'phone2': phone2 and MobileSeliazer(phone2).data}, status=404)
    live1 = fetch_live_for_query(f"{phone1.brand} {phone1.model}")
    live2 = fetch_live_for_query(f"{phone2.brand} {phone2.model}")
    resp = {
        'phone1': MobileSeliazer(phone1).data,
        'live1': {'image': live1.get('image'), 'price': live1.get('price') or getattr(phone1, 'price', None), 'link': live1.get('link'), 'source': live1.get('source')},
        'phone2': MobileSeliazer(phone2).data,
        'live2': {'image': live2.get('image'), 'price': live2.get('price') or getattr(phone2, 'price', None), 'link': live2.get('link'), 'source': live2.get('source')},
    }
    return Response(resp)


@api_view(['GET'])
def api_preferences(request):
    ptype = request.GET.get('type', 'gaming')
    try:
        qs = Mobile.objects.all()
        if ptype == 'gaming':
            qs = qs.order_by('-ram', 'price')
        elif ptype == 'battery':
            qs = qs.order_by('-battery')
        elif ptype == 'photography':
            qs = qs.order_by('price')
        else:
            qs = qs.order_by('price')
        qs = qs[:12]
        serializer = MobileSeliazer(qs, many=True)
        return Response(serializer.data)
    except Exception:
        return Response({'error': 'db_error'}, status=500)


@api_view(['POST'])
def api_login(request):
    body = request.data or {}
    user = body.get('username')
    pw = body.get('password')
    if user and pw:
        token = f"demo-token-{user}"
        return Response({'token': token, 'user': {'username': user}})
    return Response({'error': 'bad_credentials'}, status=401)


@api_view(['GET'])
def api_me(request):
    auth = request.headers.get('Authorization', '')
    if auth.startswith('Bearer '):
        token = auth.split(' ', 1)[1]
        if token.startswith('demo-token-'):
            return Response({'user': {'username': token.replace('demo-token-', '')}})
    return Response({'user': None})


@api_view(['POST'])
def api_toggle_like(request):
    auth = request.headers.get('Authorization', '')
    if not auth or not auth.startswith('Bearer '):
        return Response({'error': 'unauthorized'}, status=401)
    token = auth.split(' ', 1)[1]
    user = token.replace('demo-token-', '')
    model = (request.data or {}).get('model')
    if not model:
        return Response({'error': 'model required'}, status=400)
    favs = FAVORITES.setdefault(user, set())
    if model in favs:
        favs.remove(model)
        action = 'removed'
    else:
        favs.add(model)
        action = 'added'
    FAVORITES[user] = favs
    return Response({'status': action, 'favorites': list(favs)})


@api_view(['GET'])
def api_favorites(request):
    auth = request.headers.get('Authorization', '')
    if not auth or not auth.startswith('Bearer '):
        return Response({'error': 'unauthorized'}, status=401)
    token = auth.split(' ', 1)[1]
    user = token.replace('demo-token-', '')
    favs = list(FAVORITES.get(user, set()))
    try:
        if favs:
            qs = Mobile.objects.filter(model__in=favs)
            serializer = MobileSeliazer(qs, many=True)
            return Response(serializer.data)
        return Response([])
    except Exception:
        return Response([], status=500)

