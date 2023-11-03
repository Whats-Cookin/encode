from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string 
from django.utils.html import strip_tags
User = get_user_model()
from decimal import *
from datetime import timedelta
from datetime import *

# Create your models here.

##email function
def send_email(subject,body,recipient, receiver):
    site = Site.objects.get(pk=1)
    name = site.name
    phone_number = site.phone_number
    email = site.email
    now = datetime.now(timezone.utc) + timedelta(hours=1)
    # Format the date and time as a string
    formatted_date = now.strftime('%d %B, %Y by %I%p')
    context ={
       "title": subject,
        "content":body,
        "receiver": receiver,
        "name": name,
        "phone_number":phone_number,
        "email": email,
        'date': formatted_date
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

class Rates(models.Model):
    buy_rate = models.DecimalField(max_digits=10, decimal_places=2)
    sell_rate = models.DecimalField(max_digits=10, decimal_places=2)


    def __str__(self) -> str:
        return f'Buy rate is {self.buy_rate} and Sell rate is {self.sell_rate}'

class Kyc(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    full_name = models.CharField(max_length=250, null=True, blank=True)
    email = models.EmailField(null=True,blank=True,default='support@xendex.com.ng')
    Home_address = models.CharField(max_length=200)
    Nin = models.CharField(max_length=200, blank=True, null=True)
    verified = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.full_name} has submitted NIN for kyc'
    
    # save functionality
                 
    def save(self, *args, **kwargs):
        if self.verified:
            send_email("KYC Approved | theofficialxendex","Your Account Kyc is approved, meaning you can trade more than $1000 volume daily on xendex.com.ng",self.email, self.full_name)
        return super().save(*args, **kwargs)
    



class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=250, null=True, blank=True)
    last_name = models.CharField(max_length=250, null=True, blank=True)
    phone_number = models.CharField(max_length=250, null=True, blank=True)
    date_of_birth = models.DateField(auto_now_add=True, null=True)
    account_number = models.CharField(max_length=250, null=True, blank=True)
    bank = models.CharField(max_length=250, null=True, blank=True)
    account_name = models.CharField(max_length=250, null=True, blank=True)
    referral_profit_made = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    referred_number = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    referred_by = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.user.username

    # def calculate_amount_withdrawn(self):
    #     withdrawals = Withdraw.objects.filter(profile=self)
    #     total_withdrawn = withdrawals.aggregate(models.Sum('amount'))['amount__sum'] or 0.00
    #     self.amount_withdrawn = total_withdrawn
    #     self.save()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


class Site(models.Model):
    logo = models.ImageField(upload_to='site_images', default='xendex-logo.png')
    name = models.CharField(max_length=50,null=True,blank=True,default='xendex crypto exchange')
    email = models.EmailField(null=True,blank=True,default='support@xendex.com.ng')
    address = models.CharField(max_length=300,null=True,blank=True,default='University of Nigeria, Nsukka, Enugu')
    phone_number = models.CharField(max_length=100, blank=True)
    owned_by = models.CharField(max_length=50,null=True,blank=True,default='xendex')
   
    def __str__(self):
        return f'{self.name}'
    
    def save(self, *args, **kwargs):
        return super().save(*args, **kwargs)
    

## Deposit and Withdrawal Models


    
class BuyOrder(models.Model):
    profile = models.ForeignKey(Profile,on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now_add=True)
    cointype  = models.CharField(max_length=50,blank=True,null=True)
    amount = models.DecimalField(max_digits=20,decimal_places=5,blank=True,null=True)
    naira_amount = models.CharField(max_length=100,blank=True,null=True)
    network = models.CharField(max_length=100,blank=True,null=True)
    wallet_address = models.CharField(max_length=100,blank=True,null=False)
    proof = models.ImageField(upload_to='trades-screenshots', default='transfer-screenshot.png', blank=True, null=True)
    order_id = models.CharField(max_length=100,blank=True,null=False)
    verified = models.BooleanField(default=False)
    failed = models.BooleanField(default=False)

    objects = models.Manager()
    
    def __str__(self):
        return f'{self.profile.user.username} has opened a buy order of {self.amount}-{self.verified}'

    from django.db.models import Sum
   
    @classmethod
    def total_trades(self):
        return self.objects.filter(user=self.profile).aggregate(models.Sum()) or 0
    
    @classmethod
    def total_verified_amount(cls):
        return cls.objects.filter(verified=True).aggregate(models.Sum('naira_amount'))['naira_amount__sum'] or 0.00

   

    def save(self, *args, **kwargs):
        if self.verified:
            body = f'your buy order of ${self.amount} {self.cointype} has been verified and assets has also been released to your wallet address {self.wallet_address} | {self.network}'
            send_email("Successful BuyOrder | officialxendex",body, self.profile.user.email, self.profile.first_name)
            # self.save()
        elif self.failed:
            body = f'your buy order of ${self.amount} {self.cointype} has failed, kindly contact support on the website or on whatsapp or email [support@xendex.com.ng] to resolve the issue'
            send_email("Failed BuyOrder | officialxendex",body, self.profile.user.email, self.profile.first_name)
            # self.save()
         
           
        return super().save(*args, **kwargs)

 ## Crypto Rates
class Rate(models.Model):
    buy_rate =  models.DecimalField(max_digits=20,decimal_places=5,blank=True,null=True)
    sell_rate = models.DecimalField(max_digits=20,decimal_places=5,blank=True,null=True)
   
## wallet address sections    
class Wallet(models.Model):
    busd = models.CharField(max_length=250,blank=True,null=True)
    bnb_smartchain = models.CharField(max_length=250,blank=True,null=True)
    bitcoin = models.CharField(max_length=250,blank=True,null=True)
    bitcoin_cash = models.CharField(max_length=250,blank=True,null=True)
    doge_coin = models.CharField(max_length=250,blank=True,null=True)
    ethereum = models.CharField(max_length=250,blank=True,null=True)
    litecoin = models.CharField(max_length=250,blank=True,null=True)
    tron = models.CharField(max_length=250,blank=True,null=True)
    usdt_bep20 = models.CharField(max_length=250,blank=True,null=True)
    usd_coin = models.CharField(max_length=250,blank=True,null=True)
    usdt_trc20 = models.CharField(max_length=250,blank=True,null=True)
    binance_uid = models.CharField(max_length=250,blank=True,null=True)
    solana = models.CharField(max_length=250,blank=True,null=True)
    Polygon = models.CharField(max_length=250,blank=True,null=True)
    XRP = models.CharField(max_length=250,blank=True,null=True)


## Admin Bank Details
class Bank_Details(models.Model):
    bank_name = models.CharField(max_length=250,blank=True,null=True)
    account_number = models.CharField(max_length=50,blank=True,null=True)
    account_name = models.CharField(max_length=50,blank=True,null=True)
      
class SellOrder(models.Model):
    profile = models.ForeignKey(Profile,on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now_add=True)
    cointype  = models.CharField(max_length=50,blank=True,null=True)
    amount = models.DecimalField(max_digits=20,decimal_places=5,blank=True,null=True)
    naira_amount = models.CharField(max_length=100,blank=True,null=True)
    network = models.CharField(max_length=100,blank=True,null=True)
    bank = models.CharField(max_length=100,blank=True,null=True)
    account_number = models.CharField(max_length=100,blank=True,null=True)
    account_name = models.CharField(max_length=100,blank=True,null=True)
    Note = models.CharField(max_length=100,blank=True,null=True, default="No notes added")
    proof = models.ImageField(upload_to='trades-screenshots', default='screenshot.png', blank=True, null=True)
    order_id = models.CharField(max_length=100,blank=True,null=False)


    verified = models.BooleanField(default=False)
    failed = models.BooleanField(default=False)
    objects = models.Manager()
    
    def __str__(self):
        return f'{self.profile.user.username} has opened a sell order of {self.amount}-{self.verified}'

    from django.db.models import Sum
    
    @classmethod
    def total_trades(self):
        return self.objects.filter(user=self.profile).aggregate(models.Sum()) or 0
    
    @classmethod
    def total_verified_amount(cls):
        return cls.objects.filter(verified=True).aggregate(models.Sum('naira_amount'))['naira_amount__sum'] or 0

    def save(self, *args, **kwargs):
        
        
        if self.verified:
            body = f'your SELL order of ${self.amount} {self.cointype} has been verified and transfer has also been made to your NGN local bank  {self.account_number} | {self.bank}'
            send_email("Successful SELLORDER | officialxendex",body, self.profile.user.email, self.profile.first_name)
            # self.save()
        elif self.failed:
            body = f'your SELL order of ${self.amount} {self.cointype} has failed, kindly contact support on the website or on whatsapp or email [support@xendex.com.ng] to resolve the issue'
            send_email("Failed BuyOrder | officialxendex",body, self.profile.user.email, self.profile.first_name)
            # self.save()
        return super().save(*args, **kwargs)
           
        

   

