from itertools import chain
from .models import BuyOrder, SellOrder

def orders_view(request):
    # Get the current user
    user = request.user

    # Fetch BuyOrders and SellOrders related to the user
    buy_orders = BuyOrder.objects.filter(user=user)
    sell_orders = SellOrder.objects.filter(user=user)

    # Combine the buy_orders and sell_orders into a single iterable
    orders = list(chain(buy_orders, sell_orders))

    # Pass the orders to the template
    context = {
        'orders': orders
    }

    return render(request, 'template_name.html', context)

from .models import BuyOrder, SellOrder

def orders_view(request):
    # Get the current user
    user = request.user

    # Fetch all BuyOrders and SellOrders related to the user
    buy_orders = BuyOrder.objects.filter(user=user)
    sell_orders = SellOrder.objects.filter(user=user)

    # Pass the buy_orders and sell_orders to the template
    context = {
        'buy_orders': buy_orders,
        'sell_orders': sell_orders
    }

    return render(request, 'template_name.html', context)


<!-- template_name.html -->
<h1>Buy Orders:</h1>
<ul>
  {% for buy_order in buy_orders %}
    <li>{{ buy_order.field_name }}</li>  <!-- Replace field_name with the field you want to display -->
  {% endfor %}
</ul>

<h1>Sell Orders:</h1>
<ul>
  {% for sell_order in sell_orders %}
    <li>{{ sell_order.field_name }}</li>  <!-- Replace field_name with the field you want to display -->
  {% endfor %}
</ul>

<!-- template_name.html -->
<h1>All Orders:</h1>
<ul>
  {% for order in orders %}
    <li>{{ order.field_name }}</li>  <!-- Replace field_name with the field you want to display -->
  {% endfor %}
</ul>