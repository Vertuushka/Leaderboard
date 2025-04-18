from django.shortcuts import render, redirect
from .models import *

# Create your views here.
def tools(request):
    # if not request.user.is_authenticated or not request.user.is_staff:
    #     return redirect('index')
    # else:
        shows = Show.objects.all()
        context = {
            "shows": shows,
        }
        return render(request, 'tools.html', context)