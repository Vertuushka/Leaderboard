from django.shortcuts import render, redirect

# Create your views here.
def tools(request):
    # if not request.user.is_authenticated or not request.user.is_staff:
    #     return redirect('index')
    # else:
        return render(request, 'tools.html')