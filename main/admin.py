from django.contrib import admin
from . models import *
# Register your models here.

@admin.register(GlobalSettings)
class GlobalSettingsAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not GlobalSettings.objects.exists()