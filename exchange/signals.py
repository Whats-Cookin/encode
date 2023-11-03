from allauth.account.signals import user_logged_in,user_signed_up
from django.dispatch.dispatcher import receiver
from django.conf import settings
# from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .models import Profile, Site

def send_email(subject,body,recipient):
    try:
        site = Site.objects.get(id=1)
    except Site.DoesNotExist:
        site = Site.objects.create(id=1)
        site.save()
    name = site.name
    address = site.address
    phone_number = site.phone_number
    email = site.email
    logo = site.logo.url
    context ={
        "title": subject,
        "content":body,
        "name": name,
        "address": address,
        "phone_number":phone_number,
        "email": email,
        "logo":logo
        }   
    html_content = render_to_string("emails.html", context)
    text_content = strip_tags(html_content)
    email = EmailMultiAlternatives(
        subject,
        text_content,
        settings.EMAIL_HOST_USER ,
        [recipient]
    )
    email.attach_alternative(html_content, 'text/html')
    email.send()
 

@receiver(user_logged_in)
def user_logged_in_(request, user, **kwargs):
    subject = 'Account Login Successful, we\'re glad you considered us today'
    body = f"Dear {request.user.username}, We're glad to see you back on our xendex.com.ng! We hope you had a great time since your last visit. Don't hesitate to reach out to us if you have any questions or need help with anything. Our customer support team is always here to assist you. Enjoy your time on our xendex exchange! Best regards,{request.user.username}"
    send_email(subject,body,request.user.email)
    userprofile = Profile.objects.filter(user = request.user)

        
    
    
      
     
        
@receiver(user_signed_up)
def user_signed_up_(request, user, **kwargs):
    if user.is_authenticated:
        subject = 'Signup Successful, Welcome to our official xendex exchange'
        body_two = f"""
            Dear {user.username},
                Thank you for signing up xendex.com.ng!
                We're excited to have you as a customer and look forward to providing you with a great user experience.
                If you have any questions or need help navigating your way around xendex-exchange,
                please don't hesitate to reach out to us.
                Our customer support team is here to assist you always.
                In the meantime, take a look around and see all the great rates we offer for all transactions.
                We're sure you'll enjoy our service here at xendex-exchange.

                Best regards,
                {user.username}
        """
        body = f"Dear Admin, The new user {user.username} has signed up"
        send_email(subject, body_two, user.email)
        send_email(subject, body, 'support@xendex.com.ng')
   