from django.shortcuts import render
from collections import defaultdict
from .utils import *
from tools.models import *
from . models import GlobalSettings

# Create your views here.
def index(request):
    context = defaultdict(lambda: None)
    try:
        show = GlobalSettings.objects.get(id=1).state
        context['show'] = show
        context['performances'] = Performance.objects.filter(show=show)
        context['participants'] = Participant.objects.all()
    except Exception as e:
        error = build_error_msg(e)
        context['error'] = error    

    return render(request, "index.html", context)