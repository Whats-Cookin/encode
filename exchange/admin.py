from django.contrib import admin
from exchange.models import Profile, Kyc, Site, BuyOrder, SellOrder, Bank_Details, Rate, Wallet
from django.contrib import admin
from django.contrib.auth.models import User
from django.conf import settings

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    pass

@admin.register(Kyc)
class KycAdmin(admin.ModelAdmin):
    list_display = ('full_name','Home_address','Nin','verified')
    list_editable=  ('verified',)
    
@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = ('owned_by','name','email','address','logo','phone_number')
    list_editable = ('name','email','address','logo','phone_number')
    list_display_links = ('owned_by',)
    
@admin.register(BuyOrder)
class BuyOrderAdmin(admin.ModelAdmin):
    list_display = ('profile','cointype','network','wallet_address')
    list_filter = ('cointype',)
    ## add search field in here
    list_display_links = ('profile',)
    
@admin.register(SellOrder)
class SellOrderAdmin(admin.ModelAdmin):
    list_display = ('profile','cointype','network','account_number', 'bank', 'proof')
    list_display_links = ('profile',)
    
@admin.register(Bank_Details)
class BankDetailAdmin(admin.ModelAdmin):
    list_display = ('bank_name','account_number','account_name')
    list_display_links = ('bank_name',)

@admin.register(Rate)
class RateAdmin(admin.ModelAdmin):
    list_display = ('buy_rate', 'sell_rate')

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    pass
