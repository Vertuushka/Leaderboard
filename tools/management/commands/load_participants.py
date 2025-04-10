import os
import json
from django.core.management.base import BaseCommand
from tools.models import Participant, Show, Performance
from django.conf import settings

file_path = os.path.join(settings.BASE_DIR, 'data', 'participants.JSON')

class Command(BaseCommand):
    help = 'Populate participants table from JSON file'

    def handle(self, *args, **options):
        if Participant.objects.exists():
            self.stdout.write(self.style.WARNING('Participants table is not empty. Skipping population.'))
            return

        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            for entry in data:
                Participant.objects.create(**entry)
                
            self.stdout.write(self.style.SUCCESS('Participants table populated.'))