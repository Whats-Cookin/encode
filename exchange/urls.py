from django.urls import path
from . import views

urlpatterns = [                   
            path('profile',views.profile, name='profile'),
            path('buy_sell',views.buy_sell, name='buy_sell'),
            path('confirm_sell',views.confirm_sell, name='confirm_sell'),
            path('confirm_buy/',views.confirm_buy, name='confirm_buy'),
            path('',views.index_dashboard, name='dashboard'),
            path('Refferal_promo',views.Refferal_promo, name='Refferal_promo'),
            path('kyc', views.kyc, name='kyc')
                        
]
#urls created                   
                            