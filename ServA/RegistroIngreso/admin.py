from django.contrib import admin
from .models import Pizza, Ingrediente, Pedido, DetallePedido, Promocion

admin.site.register(Pizza)
admin.site.register(Ingrediente)
admin.site.register(Pedido)
admin.site.register(DetallePedido)
admin.site.register(Promocion)