from django.db import models
from tools.models import Show

# Create your models here.
class GlobalSettings(models.Model):
    state = models.OneToOneField(
        Show,
        on_delete=models.CASCADE,
        related_name='global_settings',
        default=1
    )

    class Meta:
        verbose_name = "Global state"
        verbose_name_plural = "Global state"

    def __str__(self):
        return f"Global state: {self.state}"