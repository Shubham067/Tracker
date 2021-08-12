from celery.decorators import task
from celery.utils.log import get_task_logger

from .emails import send_email

logger = get_task_logger(__name__)


@task(name="send_email_task")
def send_email_task(username, email, password, subject):
    """sends an email after successful user signup"""
    logger.info("Sent welcome email")
    return send_email(username, email, password, subject)