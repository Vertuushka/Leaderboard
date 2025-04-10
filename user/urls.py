from django.urls import path
from . import views

urlpatterns = [
    path('', views.user_login, name="login"),
    path('auth/', views.user_create, name="create"),
    path('new_session/<slug:token>/', views.new_session, name="new_session")
]
