from django.shortcuts import render, redirect, HttpResponse
from django.utils.crypto import get_random_string
from .models import Account
from django.contrib.auth.models import User
from django.contrib.auth import login, logout
import random
from django.contrib import messages

# main login page
def user_login(request):
    if request.user.is_authenticated:
        return HttpResponse("User already logged in")
    return render(request,'login.html')

# this function handles user creation
def user_create(request):
    if request.user.is_authenticated:
        return HttpResponse("User already logged in")
    if request.method == "POST":
        username = request.POST.get('username')
        try:
            user = User.objects.get(username=username)
            message.info(request, username)
            return redirect('new_session')
        except:
            token = get_random_string(length=25)
            pass_code = random.randint(10, 99)
            isUnique = False
            while isUnique == False:
                try:
                    Account.objects.get(pass_code=pass_code)
                    pass_code = random.randint(10, 99)
                except:
                    isUnique = True
            user = User.objects.create(username=username)
            login(request, user)
            Account.objects.create(user=user, auth_token=token, pass_code=pass_code)
            return HttpResponse("User Created, logged in. Passcode: " + str(pass_code))
    else:
        return redirect('login')

# this function allow user to login to their account via link/qr code
def new_session(request):
    if request.method == "POST":
        username = request.POST.get("username")
        pass_code = request.POST.get("pass_code")
        try:
            user = User.objects.get(username=username)
            account = Account.objects.get(user=user, pass_code=pass_code)
            login(request, user)
            return redirect("index")
        except:
             return HttpResponse("Invalid passcode/username")
    else:
        return redirect("login")