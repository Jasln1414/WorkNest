# email.py

from django.core.mail import send_mail
import random
from django.conf import settings
from user_account.models import User
# Remove this line: from django.utils.log import logger
import logging

# Set up the logger correctly
logger = logging.getLogger(__name__)

# Rest of your code remains the same
def send_otp_via_mail(email, otp=None):
    subject = 'Welcome to WorkNest !! User Verification Mail'
    # Only generate a random OTP if one wasn't provided
    if otp is None:
        otp = random.randint(1000, 9999)
        print(f"Generated OTP: {otp} for {email}")
    message = f'Your OTP is {otp}'
    email_from = settings.EMAIL_HOST_USER
    
    try:
        send_mail(subject, message, email_from, [email])
        user_obj = User.objects.get(email=email)
        user_obj.otp = otp
        user_obj.save()
        logger.info(f"OTP sent to {email}: {otp}")
        return True
    except Exception as e:
        logger.error(f"Error sending OTP email: {e}")
        return False

def resend_otp_via_mail(email,otp=None):
    subject = 'Welcome Again !! User Verification Mail'
    otp = random.randint(1000, 9999)
    message = f'Your OTP is {otp}'
    email_from = settings.EMAIL_HOST_USER
    
    try:
        send_mail(subject, message, email_from, [email])
        user_obj = User.objects.get(email=email)
        user_obj.otp = otp
        user_obj.save()
        logger.info(f"OTP resent to {email}: {otp}")
    except Exception as e:
        logger.error(f"Error resending OTP email: {e}")