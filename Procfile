release: python manage.py migrate
web: gunicorn Tracker.wsgi --log-file -
worker: celery worker -A Tracker -l info -c 4