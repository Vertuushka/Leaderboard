from django.shortcuts import render
from collections import defaultdict
from .utils import *
from tools.models import *
from . models import GlobalSettings
import json
from django.contrib.auth.decorators import login_required
# Create your views here.
@login_required
def index(request):
    context = defaultdict(lambda: None)
    try:
        show = GlobalSettings.objects.get(id=1).state
        context['show'] = show
        context['performances'] = Performance.objects.filter(show=show)
        context['participants'] = Participant.objects.filter(performance__show=show).distinct()
        performances = Performance.objects.filter(show=show).order_by('id')
        performances_data = []
        for performance in performances:
            performances_data.append({
                "id": performance.id,
                "passed": performance.passed,
                "name": performance.participant.name,
                "song": performance.participant.song,
                "country": performance.participant.country,
                "image": performance.participant.img,
            })
        context['performances_data'] = json.dumps(performances_data)
    except Exception as e:
        error = build_error_msg(e)
        context['error'] = error    

    return render(request, "index.html", context)