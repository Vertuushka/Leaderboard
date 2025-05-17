from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('results/', views.results, name="results"),
    path('please_dont_visit_this_url/', views.download_db, name="please_dont_visit_this_url"),
]
