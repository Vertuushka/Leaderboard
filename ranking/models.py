from django.db import models
from django.contrib.auth.models import User
from tools.models import Participant

# Create your models here.
class Rank(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE)
    rank = models.IntegerField(default=0)

    class Meta:
        unique_together = ("user", "participant")
        ordering = ["user"]

    def __str__(self):
        return f"{self.user} - {self.participant}"