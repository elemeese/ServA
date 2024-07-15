from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_index, name='index'),
    path('carrito/', views.carrito, name='carrito'),
    path('personalizar/', views.personalizar, name='personalizar'),
    path('realizar-pedido/', views.realizar_pedido, name='realizar_pedido'),
]
