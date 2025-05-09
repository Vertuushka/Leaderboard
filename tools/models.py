from django.db import models
from django.contrib.auth.models import User

class Participant(models.Model):
    name = models.CharField(max_length=100)
    song = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    img = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f'{self.country} - {self.name}'

class Show(models.Model):
    SHOW_TYPES = [
        ('SF1', 'Semi Final 1'),
        ('SF2', 'Semi Final 2'),
        ('GF', 'Grand Final'),
        ('N', 'End'),
    ]
    name = models.CharField(max_length=3, choices=SHOW_TYPES, unique=True)

    def __str__(self):
        return dict(self.SHOW_TYPES)[self.name]

class Performance(models.Model):
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE)
    show = models.ForeignKey(Show, on_delete=models.CASCADE)
    order = models.IntegerField()
    # semi-final only
    points = models.IntegerField(null=True, blank=True, default=0)
    passed = models.BooleanField(null=True, blank=True, default=False) 
    # grand final only
    jury = models.IntegerField(null=True, blank=True, default=0)
    votes = models.IntegerField(null=True, blank=True, default=0)

    class Meta:
        unique_together = ('participant', 'show')

    def __str__(self):
        return f'{self.participant} - {self.show}'

class Vote(models.Model):
    CRITERIA_TYPES = [
        (1, 'Qualified'),
        (2, 'Musical Quality'),
        (3, 'Stage Performance'),
        (4, 'Visual Presentation'),
    ]
    performance = models.ForeignKey(Performance, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    criteria = models.IntegerField(choices=CRITERIA_TYPES)
    grade = models.IntegerField()

    def __str__(self):
        return f"{self.user} - {self.performance} - {self.criteria} - {self.grade}"