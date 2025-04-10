import os
import json
from django.core.management.base import BaseCommand
from tools.models import Participant, Show, Performance
from django.conf import settings

file_path = os.path.join(settings.BASE_DIR, 'data', 'semifinal1.JSON')

class Command(BaseCommand):
    help = 'Populate Performance table with data for first semi-final from JSON file'

    def handle(self, *args, **options):
        if Performance.objects.filter(show__name='SF1'):
            self.stdout.write(self.style.WARNING('First semi-final data is already imported.'))
            return
        else:
            with open(file_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
                for entry in data:
                    try:
                        participant = Participant.objects.get(country=entry['country'])
                        show = Show.objects.get(name=entry["show_name"])

                        Performance.objects.create(
                        participant=participant,
                        show=show,
                        order=entry["order"],
                        passed=entry["passed"] or False,
                    )
                    except Participant.DoesNotExist:
                        self.stdout.write(self.style.WARNING(f'Participant not found: {entry["participant_country"]}. Skipping entry.'))
                    except Show.DoesNotExist:
                        self.stdout.write(self.style.WARNING(f'Show not found: {entry["show_name"]}. Skipping entry.'))
                self.stdout.write(self.style.SUCCESS('First semi-final data is loaded.'))