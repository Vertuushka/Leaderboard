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
    user = request.user
    state = GlobalSettings.objects.get(id=1).state.id
    if state == 1:
        return redirect("index")
    context = {}
    show_names = []
    performances = []
    user_votes = []
    if state == 2:
        show_names = ["Semi Final 1"]
        perf_qs = Performance.objects.filter(show__id=1)
        performances = [perf_qs]
        user_votes = [Vote.objects.filter(performance__in=perf_qs, user=user)]
    if state == 3:
        performances_all = Performance.objects.filter(show__id__in=[1,2])
        show_names = ["Semi Final 2", "Semi Final 1" ]
        perf_qs1 = performances_all.filter(show__id=2)
        perf_qs2 = performances_all.filter(show__id=1)
        performances = [perf_qs1, perf_qs2]
        user_votes = [Vote.objects.filter(performance__in=perf_qs1, user=user), Vote.objects.filter(performance__in=perf_qs2, user=user)]
    if state == 4:
        performances = Performance.objects.filter(show__id__in=[3])
        show_names = ["Grand Final"]
        performances = [performances]
        u_votes = Vote.objects.filter(performance__in=performances, user=user)
        for performance in performances:
            grade = 0
            for i in range(2, 5):
                try:
                    vote = Vote.objects.get(performance=performance, criteria=i)
                    grade += vote.grade
                except:
                    pass
            user_votes.append([grade])
            

    data = zip(show_names, performances, user_votes)
    context['data'] = data
    return render(request, "results.html", context)
