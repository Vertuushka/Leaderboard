from django.urls import path
from . import views

urlpatterns = [
    path('', views.user_login, name="login"),
    path('auth/', views.user_create, name="create"),
    path('new_session/', views.new_session, name="new_session")
]
