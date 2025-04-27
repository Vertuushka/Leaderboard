from django.db import models

# Create your models here.
class GlobalSettings(models.Model):
    state = models.CharField(max_length=50, choices=[
        ('SF1', 'Sefmi-final 1'),
        ('SF2', 'Semi-final 2'),
        ('GF', 'Grand final'),
    ], default='SF1')

    class Meta:
        verbose_name = "Global state"
        verbose_name_plural = "Global state"

    def __str__(self):
        return f"Global state: {self.state}"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj