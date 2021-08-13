from django.template.loader import get_template
from django.core.mail import EmailMessage
from django.conf import settings


def send_email(username, email, password, subject, template, user):
    message = get_template(template).render(user)
    # message = f"Hello {user.get('username')}"
    msg = EmailMessage(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [user.get('email')]
    )
    
    msg.content_subtype = "html"  # Main content is now text/html
    res = msg.send()
    
    print("Email sent successfully!")
