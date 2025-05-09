from django.shortcuts import render, HttpResponse, redirect
from collections import defaultdict
from .utils import *
from tools.models import *
from . models import GlobalSettings
import json
from django.contrib.auth.decorators import login_required

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

@login_required
def results(request):
    state = GlobalSettings.objects.get(id=1).state.id
    if state == 1:
        return redirect("index")
    context = {}
    show_names = []
    performances = []
    if state == 2:
        show_names = ["Semi Final 1"]
        performances = [Performance.objects.filter(show__id__in=[1])]
    if state == 3:
        performances_all = Performance.objects.filter(show__id__in=[1,2])
        show_names = ["Semi Final 2", "Semi Final 1" ]
        performances = [performances_all.filter(show__id=2), performances_all.filter(show__id=1)]
    if state == 4:
        performances = Performance.objects.filter(show__id__in=[3])
        show_names = ["Grand Final"]
        performances = [performances]

    data = zip(show_names, performances)
    context['data'] = data
    return render(request, "results.html", context)
