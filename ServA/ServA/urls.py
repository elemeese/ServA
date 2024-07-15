from django.contrib import admin
from django.urls import include, path
from RegistroIngreso import views as registro_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', registro_views.home_index, name='index'),
    path('carrito/', registro_views.carrito, name='carrito'),
    path('personalizar/', registro_views.personalizar, name='personalizar'),
    path('realizar-pedido/', registro_views.realizar_pedido, name='realizar_pedido'),
]