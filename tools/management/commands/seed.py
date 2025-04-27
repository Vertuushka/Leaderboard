import os
import json
from django.core.management.base import BaseCommand
from tools.models import Participant, Show, Performance
from main.models import GlobalSettings
from django.conf import settings

participants_data = os.path.join(settings.BASE_DIR, 'data', 'participants.JSON')
sf1_data = os.path.join(settings.BASE_DIR, 'data', 'semifinal1.JSON')
sf2_data = os.path.join(settings.BASE_DIR, 'data', 'semifinal2.JSON')

class Command(BaseCommand):
    help = 'Populate needed tables'

    def handle(self, *args, **options):

        # global settings data load
        if GlobalSettings.objects.exists():
            self.stdout.write(self.style.WARNING('Global settings table is not empty. Skipping table.'))
        else:
            GlobalSettings.objects.create( state = 'SF1' )
            self.stdout.write(self.style.SUCCESS('Global state is set to SF1.'))

        if Show.objects.exists():
            self.stdout.write(self.style.WARNING('Shows table is not empty. Skipping table.'))
        else:
            Show.objects.create(name='SF1')
            Show.objects.create(name='SF2')
            Show.objects.create(name='GF')
            self.stdout.write(self.style.SUCCESS('Shows table populated.'))


        # participants data load
        if Participant.objects.exists():
            self.stdout.write(self.style.WARNING('Participants table is not empty. Skipping table.'))
        else:
            with open(participants_data, 'r', encoding='utf-8') as file:
                data = json.load(file)
                for entry in data:
                    Participant.objects.create(**entry)
                self.stdout.write(self.style.SUCCESS('Participants table populated.'))

        # semi-final 1 data load
        if Performance.objects.filter(show__name='SF1'):
            self.stdout.write(self.style.WARNING('First semi-final data is already imported.'))
        else:
            with open(sf1_data, 'r', encoding='utf-8') as file:
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

        # semi-final 2 data load
        if Performance.objects.filter(show__name='SF2'):
            self.stdout.write(self.style.WARNING('Second semi-final data is already imported.'))
        else:
            with open(sf2_data, 'r', encoding='utf-8') as file:
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
                self.stdout.write(self.style.SUCCESS('Second semi-final data is loaded.'))

