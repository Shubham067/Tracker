"""
WSGI config for Tracker project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os
import dotenv

from django.core.wsgi import get_wsgi_application
from pathlib import Path
from whitenoise import WhiteNoise

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

dotenv.load_dotenv(
    os.path.join(BASE_DIR, '.env')
)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Tracker.settings')

if os.getenv('DJANGO_SETTINGS_MODULE'):
    os.environ['DJANGO_SETTINGS_MODULE'] = os.getenv('DJANGO_SETTINGS_MODULE')

application = get_wsgi_application()
application = WhiteNoise(application, root = os.path.join(BASE_DIR, 'staticfiles'))
