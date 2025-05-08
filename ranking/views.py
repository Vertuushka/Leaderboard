from django.shortcuts import render, redirect, HttpResponse
from tools.models import Participant
from .models import Rank
from django.contrib.auth.decorators import login_required

# Create your views here.
@login_required
def ranking(request):
    participants = Participant.objects.all()
    context = {
        "participants": participants,
    }
    return HttpResponse("Ranking page")

@login_required
def ranking_update(request):
    if request.method == "POST":
        user = request.user
        participants = Participant.objects.all()
        for participant in participants:
            rank = request.POST.get(f"{participant.id}")
            if rank:
                rank = int(rank)
                Rank.objects.filter(user=user, rank=rank).exclude(participant=participant).delete()
                Rank.objects.update_or_create(user=user, participant=participant, rank=rank)
    return redirect("ranking")
    