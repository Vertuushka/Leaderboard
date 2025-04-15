from django.urls import path
from . import views

urlpatterns = [
    path('', views.ranking, name="ranking"),
    path('update/', views.ranking_update, name="ranking_update"),
]
