release: python manage.py migrate
web: gunicorn Tracker.wsgi --log-file -
worker: celery -A Tracker worker -l info -c 4