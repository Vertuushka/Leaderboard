from django.shortcuts import render, redirect
from .models import *
from main.models import GlobalSettings
from django.forms.models import model_to_dict
import json
# Create your views here.
def tools(request):
    # if not request.user.is_authenticated or not request.user.is_staff:
    #     return redirect('index')
    # else:
        context = {}
        
        shows = Show.objects.all()
        show = GlobalSettings.objects.get(state=1).state
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
        context["show"] = show
        context["performances"] = json.dumps(performances_data)
        if request.user.is_staff:
            context["shows"] = shows
        return render(request, 'tools.html', context)