from django.shortcuts import render, redirect, HttpResponse
from django.utils.crypto import get_random_string
from .models import Account
from django.contrib.auth.models import User
from django.contrib.auth import login, logout

# Create your views here.
def user_login(request):
    if request.user.is_authenticated:
        return HttpResponse("User already logged in")
    return render(request,'login.html')

def user_auth(request):
    if request.user.is_authenticated:
        return HttpResponse("User already logged in")
    if request.method == "POST":
        username = request.POST.get('username')
        try:
            User.objects.get(username=username)
            return redirect('login')
        except:
            token = get_random_string(length=25)
            user = User.objects.create(username=username)
            login(request, user)
            Account.objects.create(user=user, auth_token=token)
            return HttpResponse("User Created, logged in")
        return HttpResponse("User Authenticated")
    else:
        return redirect('login')

def new_session(request, token):
    try:
        account = Account.objects.get(auth_token=token)
    except:
        return HttpResponse("Invalid token")
    else:
        user = account.user
        login(request, user)
    return HttpResponse('logged in')