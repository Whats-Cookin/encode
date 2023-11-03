from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required
from .models import *
from django.contrib import messages
from django.contrib.auth import get_user_model
from datetime import timedelta,date
import datetime
import secrets
from django.core.mail import send_mail
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import json
from datetime import *

User = get_user_model()
from itertools import chain

## for integrating lighthosue into the project
from decouple import config
import io
from lighthouseweb3 import Lighthouse

# Replace "YOUR_API_TOKEN" with your actual Lighthouse API token
lh = Lighthouse(token="202ad83e.8e7d25d3faa0429196b58357b5f11aef")


##sed mail custom function
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


@login_required(login_url='/accounts/login')
def profile(request):
    user = User.objects.get(username = request.user.username)
    try:
        site = Site.objects.get(pk=1)
    except Site.DoesNotExist:
        site = Site.objects.create(pk=1)
        site.save()
            
    # if not Profile.objects.filter(user= user.id):
    #     return redirect('/profile')
    
    
    
    ## checking for if profile exists
    if not Profile.objects.filter(user=user).exists():
        profile = None

    else:
        profile = Profile.objects.get(user=user)
    
    ## kyc section
    try:
        instance = Kyc.objects.get(user=request.user)
        verified = instance.verified
    except Kyc.DoesNotExist:
        instance = None
        verified = False
    if request.method == 'POST':
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        phone_number = request.POST['phone_number']
        date_of_birth = request.POST['date_of_birth']
        if date_of_birth is None:
            pass
        else:
            pass
        account_number = request.POST['account_number']
        bank = request.POST['bank']
        account_name = request.POST['account_name']
        # image = request.FILES.get('image')
        user = User.objects.get(username = request.user.username)
        if Profile.objects.filter(user=user).exists():
            profile = Profile.objects.get(user=user)
            profile.first_name = first_name
            profile.last_name = last_name
            profile.phone_number = phone_number
            profile.date_of_birth = date_of_birth
            profile.account_number = account_number
            profile.bank = bank
            profile.account_name = account_name
            profile.save()
        else:
            profile = Profile.objects.create(user=user,first_name=first_name, last_name=last_name, phone_number=phone_number, date_of_birth=date_of_birth, account_number=account_number, bank=bank, account_name=account_name)
            profile.save()
        return redirect('/')
    total_verified_amount_buy = BuyOrder.total_verified_amount()
    total_verified_amount_sell = SellOrder.total_verified_amount()
    
    ##gets total amount in naira 
    total_verified_amount = total_verified_amount_buy + total_verified_amount_sell
    
    ## get's total amount of trades

    buy_orders = BuyOrder.objects.filter(profile=profile).count()
    sell_orders = SellOrder.objects.filter(profile=profile).count()
    total_trades = sell_orders + buy_orders
    # print(type(buy_orders))
    context = {
        'site': site,
        'profile': profile,
        'verified':verified,
        'total_verified_amount':total_verified_amount,
        'total_trades':total_trades,

    }
    return render(request,'profile.html', context)



@login_required(login_url='/accounts/login')
def buy_sell(request):
    user = User.objects.get(username=request.user.username)

    try:
        site = Site.objects.get(pk=1)
    except Site.DoesNotExist:
        site = Site.objects.create(pk=1)
        site.save()

    if not Profile.objects.filter(user=user.id):
        return redirect('/profile')
    profile = Profile.objects.get(user=user)
    ## getting full name from kyc document
    try:
        kyc = Kyc.objects.get(user=request.user)
    except Kyc.DoesNotExist:
        kyc = None
    if request.method == 'POST':
        action = request.POST['action']  # This indicates the action is 'buy' or 'sell'
        print(action)
        if action == 'buy':
            cointype = request.POST['coin_name']
            amount = request.POST['amount']
            network = request.POST['network']
            wallet_address = request.POST['wallet_address']
            naira_amount = request.POST.get('result')
            order_id = f'VOR{secrets.token_hex(5).upper()}TEX'

            buy_order = BuyOrder.objects.create(profile=profile, cointype=cointype, amount=amount, network=network, wallet_address=wallet_address, naira_amount=naira_amount, order_id=order_id)
            buy_order.save()
            
            return redirect('/confirm_buy/?amount=' + str(amount))

        elif action == 'sell':
            cointype = request.POST['coin_name_sell']
            amount = request.POST['amount_sell']
            network = request.POST['network_sell']
            bank = request.POST['Bank_name']
            account_name = request.POST['account_name']
            account_number = request.POST['account_number']
            order_id = f'VOR{secrets.token_hex(5).upper()}TEX'

            Note = request.POST.get('Note')

            sell_order = SellOrder.objects.create(profile=profile, cointype=cointype, amount=amount, network=network, bank=bank, account_name=account_name, account_number=account_number,Note=Note, order_id=order_id )
            sell_order.save()

            return redirect('/confirm_sell')
        
    ## get the current rates from backend    
    rate_instance = Rate.objects.first()  # Assuming you want to get the first instance

    # Access the value of the buy_rate field
    buy_rate = rate_instance.buy_rate
    sell_rate = rate_instance.sell_rate

    #passing the lighthouse api to html
    lighthouse_api_key = config('202ad83e.8e7d25d3faa0429196b58357b5f11aef', default='') 

    context = {
        'site': site,
        'kyc':kyc,
        'buy_rate':buy_rate,
        'sell_rate':sell_rate,
        'profile':profile,
        'lighthouse_api_key': lighthouse_api_key
    }
    return render(request, 'buy_sell.html', context)

@login_required(login_url='/accounts/login')
def confirm_sell(request):
    user = User.objects.get(username = request.user.username)
    
    ## selling rate
    rate_instance = Rate.objects.first()  # Assuming you want to get the first instance

    # Access the value of the buy_rate field
    rate = rate_instance.sell_rate
    
   
     ## redirects if no profile instance exists for the user       
    if not Profile.objects.filter(user= user.id):
        return redirect('/profile')
    try:
        site = Site.objects.get(pk=1)
    except Site.DoesNotExist:
        site = Site.objects.create(pk=1)
        site.save()
        
    ## confirmation of successful trades 
    profile = Profile.objects.get(user=user)
    if request.method == "POST":
        proof = request.FILES.get('image_proof')
        last_sell_order = SellOrder.objects.filter(profile=profile).last()
        
       
        
        order_id = last_sell_order.order_id

        if last_sell_order:
            # Fill up the field in the POST request
            amount = Decimal(last_sell_order.amount) * rate 
 
            last_sell_order.proof = proof
            last_sell_order.naira_amount = amount
            last_sell_order.save()
            
            ##uploading to lighthouse
            tagged_source_file_path = proof
            tag = f"{last_sell_order.profile.user.username} crypto deposit proof"
            lh.upload(source=tagged_source_file_path, tag=tag)
            print("File Upload with Tag Successful!")
            
            # Replace "YOUR_CID_TO_CHECK" with the actual CID you want to check
            # file_cid_to_check = "YOUR_CID_TO_CHECK"
            # list_uploads = lh.getUploads(file_cid_to_check)
            # print("Upload Information:")
            # print(list_uploads)
            
            
            body = f" your Sell Order with id {[order_id]} has been received and is being attended to"
            #send_email("Sell Order Placed | xendex.com.ng",body,request.user.email, request.user.username)
            body2 = f"A customer placed a sell order with id {[order_id]}, kindly attend to them asap"
            #send_email("Sell Order Placed",body2,'support@xendex.com.ng', "CEO xendex exchange")
            return redirect("/")

        else:
            return messages.error("An Error occurs, you didn't create any order")
    
    ## data needed before post
    last_sell_order = SellOrder.objects.filter(profile=profile).last()
    amount = last_sell_order.amount
    
   
    network = last_sell_order.network
    
    ## handle wallet to prompt out
    wallet_instance = Wallet.objects.first()
    if network == "BEP-20":
        wallet = wallet_instance.busd
    elif network == "BEP-2":
        wallet = wallet_instance.bnb_smartchain
    elif network == "Btc":
        wallet = wallet_instance.bitcoin 
    elif network == "Bitcoin Cash":
        wallet = wallet_instance.bitcoin_cash
    elif network == "DOGE":
        wallet = wallet_instance.doge_coin
    elif network == "Erc-20":
        wallet = wallet_instance.ethereum
    elif network == "LTC":
        wallet = wallet_instance.litecoin
    elif network == "SOL":
        wallet = wallet_instance.solana
    elif network == "TRC-20":
        wallet = wallet_instance.tron
    elif network == "Polygon(Matic)":
        wallet = wallet_instance.Polygon
    elif network == "Binance-UID":
        wallet = wallet_instance.binance_uid
    elif network == "USDT(BEP20)":
        wallet = wallet_instance.usdt_bep20
    elif network == "USDT TRC20":
        wallet = wallet_instance.usdt_trc20
    elif network == "USD Coin":
        wallet = wallet_instance.usd_coin
    elif network == "USD Coin":
        wallet = wallet_instance.usd_coin
    elif network == "XRP":
        wallet = wallet_instance.usd_coin
     
    #passing the lighthouse api to html
    lighthouse_api_key = config('202ad83e.8e7d25d3faa0429196b58357b5f11aef', default='') 

    context = {
        'site': site,
        'amount': amount,
        'wallet': wallet,
        'network': network,
        'lighthouse_api_key': lighthouse_api_key 

    }
    return render(request,'confirm_sell.html', context)


def confirm_buy(request):
    amount = request.GET.get('amount')
    
    ##Rate functionality
    # Get the instance of Rate model
    rate_instance = Rate.objects.first()  # Assuming you want to get the first instance

    # Access the value of the buy_rate field
    rate = rate_instance.buy_rate
    user = User.objects.get(username = request.user.username)
    
     ##bank details functionality
    try:
        bank = Bank_Details.objects.get(pk=1)
    except Site.DoesNotExist:
        bank = Bank_Details.objects.create(pk=1)
        bank.save()
    
    ## using conditions to check rates
        
    amount = Decimal(amount) * rate
    
    ##profile
    profile = Profile.objects.get(user=user)
    ## fill up the naira value with data now
    if request.method == "POST":
        proof = request.FILES.get('image_proof')
        last_buy_order = BuyOrder.objects.filter(profile=profile).last()
        order_id = last_buy_order.order_id


        if last_buy_order:
            # Fill up the field in the POST request
            last_buy_order.naira_amount = amount
            last_buy_order.proof = proof
            last_buy_order.save()
                ##uploading to lighthouse
            tagged_source_file_path = proof
            tag = f"{last_buy_order.profile.user.username} payment proof"
            lh.upload(source=tagged_source_file_path, tag=tag)
            print("File Upload with Tag Successful!")
            
            # file_cid_to_check = "YOUR_CID_TO_CHECK"
            # list_uploads = lh.getUploads(file_cid_to_check)
            # print("Upload Information:")
            # print(list_uploads)
            body = f"your Buy Order with id {[order_id]} has been received and is being attended to"
            send_email("Buy Order Placed | xendex.com.ng",body,request.user.email, request.user.username)
            # send_email("Buy Order Placed","A customer placed a buy order, kindly attend to them asap",'support@xendex.com.ng', "CEO xendex exchange")
            body2 = f"A customer placed a buy order with id {[order_id]}, kindly attend to them asap "
            send_email("Buy Order Placed",body2,'youngtechbro@gmail.com', "support")
            return redirect("/")
        else:
            return messages.error("An Error occurs, you didn't create any order")
    try:
        site = Site.objects.get(pk=1)
    except Site.DoesNotExist:
        site = Site.objects.create(pk=1)
        site.save()
            
    if not Profile.objects.filter(user= user.id):
        return redirect('/profile')
        
    context = {
        'site': site,
        'amount':amount,
        'bank': bank

    }
    return render(request,'confirm_buy.html', context)


@login_required(login_url='/accounts/login')
def index_dashboard(request):
    user = User.objects.get(username = request.user.username)
    
    try:
        site = Site.objects.get(pk=1)
    except Site.DoesNotExist:
        site = Site.objects.create(pk=1)
        site.save()
            
    if not Profile.objects.filter(user= user.id):
        return redirect('/profile')
    profile = Profile.objects.get(user=user)
    
    ## refactor the codeblocks
    from itertools import chain

    # Assuming you have the BuyOrder and SellOrder models defined

    # Fetch Buy and Sell orders with a value in the "naira_amount" column, ordered by id
    buy_orders = BuyOrder.objects.filter(profile=profile, naira_amount__isnull=False).order_by('-id')
    sell_orders = SellOrder.objects.filter(profile=profile, naira_amount__isnull=False).order_by('-id')


    # Combine the two querysets into a single list
    orders = list(chain(buy_orders, sell_orders))

   # Sort the combined list by creation time (newest first)
    orders.sort(key=lambda order: order.time, reverse=True)


    # Now each order in the list contains its 'order_type' attribute
    for order in orders:
        if isinstance(order, BuyOrder):
            order.order_type = 'Buy Order'
        elif isinstance(order, SellOrder):
            order.order_type = 'Sell Order'

    context = {
        'site': site,
        'buy_orders': buy_orders,
        'sell_orders': sell_orders,
        'orders':orders,
        'profile':profile,
    }
    return render(request,'index_dashboard.html', context)


@login_required(login_url='/accounts/login')
def Refferal_promo(request):
    user = User.objects.get(username = request.user.username)
    
    try:
        site = Site.objects.get(pk=1)
    except Site.DoesNotExist:
        site = Site.objects.create(pk=1)
        site.save()
            
    if not Profile.objects.filter(user= user.id):
        return redirect('/profile')
    context = {
        'site': site

    }
    return render(request,'Refferal_promo.html', context)
#views created

@login_required(login_url='/accounts/login')
def kyc(request):
    try:
        site = Site.objects.get(pk=1)
    except Site.DoesNotExist:
        site = Site.objects.create(pk=1)
        site.save()
    if request.method == 'POST':
        user = request.user
        full_name = request.POST['full_name']
        email = request.POST['email']
        Home_address = request.POST['Home_address']
        Nin = request.POST['Nin']

        
        messages.info(request, 'Your KYC is submitted successfully')

        if Kyc.objects.filter(user=user).exists():
            profile = Profile.objects.get(user=user)
            profile.full_name = full_name
            profile.email = email
            profile.Home_address = Home_address
            profile.Nin = Nin
     
            profile.save()
       
        else:
            profile = Kyc.objects.create(user=user,full_name=full_name, email=email, Home_address=Home_address, Nin=Nin)
            profile.save()
        
        return redirect('/')
    
    return render(request, "kyc.html", {'site':site})


def my_custom_error_view_500(request):
    return render(request,'500.html')

def my_custom_page_not_found_view_404(request,exception):
    return render(request,'404.html')


def my_custom_bad_request_view_400(request,exception):
    return render(request,'400.html')


def my_custom_permission_denied_view_403(request,exception):
    return render(request,'403.html')