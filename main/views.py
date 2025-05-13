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
    shows_performances_votes = []
    user = request.user

    if state == 2:
        performances = Performance.objects.filter(show__id=1).order_by('id')
        votes = Vote.objects.filter(performance__in=performances, user=user, criteria=1)
        vote_map = {vote.performance_id: vote.grade for vote in votes}
        performance_vote_pairs = [(perf, vote_map.get(perf.id)) for perf in performances]
        shows_performances_votes.append(("Semi Final 1", performance_vote_pairs))


    elif state == 3:
        for show_id, show_label in [(2, "Semi Final 2"), (1, "Semi Final 1")]:
            performances = Performance.objects.filter(show__id=show_id).order_by('order')
            votes = Vote.objects.filter(performance__in=performances, user=user, criteria=1)
            vote_map = {vote.performance_id: vote.grade for vote in votes}
            performance_vote_pairs = [(perf, vote_map.get(perf.id)) for perf in performances]
            shows_performances_votes.append((show_label, performance_vote_pairs))


    elif state == 4:
        performances = Performance.objects.filter(show__id=3)
        
        votes = Vote.objects.filter(performance__in=performances, user=user, criteria__in=[2, 3, 4])
        grade_map = defaultdict(int)
        for vote in votes:
            grade_map[vote.performance_id] += vote.grade

        performances = sorted(
            performances,
            key=lambda p: (p.jury or 0) + (p.votes or 0),
            reverse=True
        )

        performance_vote_pairs = [(perf, grade_map.get(perf.id, 0)) for perf in performances]
        shows_performances_votes.append(("Grand Final", performance_vote_pairs))

    context['data'] = shows_performances_votes
    return render(request, "results.html", context)
