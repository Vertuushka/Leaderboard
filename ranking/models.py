from django.db import models
from django.contrib.auth.models import User
from tools.models import Performance

# Create your models here.
class Rank(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    performance = models.ForeignKey(Performance, on_delete=models.CASCADE)
    rank = models.IntegerField(default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "rank"], name="unique_user_rank"),
            models.UniqueConstraint(fields=["user", "performance"], name="unique_user_participant"),
        ]

    def __str__(self):
        return f"{self.user} - {self.participant}"