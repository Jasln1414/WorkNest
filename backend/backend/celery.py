""""from __future__ import absolute_import, unicode_literals
import os
import logging
from celery import Celery
from django.conf import settings
LANGUAGE_SESSION_KEY = '_language'


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
app = Celery('backend')

app.conf.enable_utc = False
app.conf.update(
    timezone='Asia/Kolkata',
)

app.config_from_object(settings, namespace='CELERY')

# Celery beat settings
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)
logger.info('Starting Celery worker')
logger.info(f'Broker URL: {app.conf.broker_url}')






# celery -A backend.celery worker --pool=solo  -l info""""