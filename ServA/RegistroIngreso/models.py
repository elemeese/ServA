from django.db import models
import random

class Pizza(models.Model):
    PIZZA_CHOICES = [
        ('peppe', 'Pizza Peppe'),
        ('roman', 'Pizza Roman'),
        ('napoles', 'Pizza Napoles'),
        ('chess', 'Pizza Chess'),
        ('personalizada', 'Pizza Personalizada'),
    ]
    
    nombre = models.CharField(max_length=20, choices=PIZZA_CHOICES)
    precio = models.DecimalField(max_digits=10, decimal_places=2, default=8000)
    descripcion = models.TextField(blank=True)
    
    def __str__(self):
        return self.get_nombre_display()

class Ingrediente(models.Model):
    nombre = models.CharField(max_length=50)
    precio_adicional = models.DecimalField(max_digits=10, decimal_places=2, default=2500)

    def __str__(self):
        return self.nombre

class Pedido(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('en_preparacion', 'En Preparación'),
        ('listo', 'Listo'),
        ('entregado', 'Entregado'),
    ]
    rut = models.CharField(max_length=12)
    telefono = models.CharField(max_length=15)
    numero_retiro = models.CharField(max_length=4, unique=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')

    def save(self, *args, **kwargs):
        if not self.numero_retiro:
            self.numero_retiro = self.generar_numero_retiro()
        super().save(*args, **kwargs)

    @staticmethod
    def generar_numero_retiro():
        while True:
            numero = str(random.randint(1000, 9999))
            if not Pedido.objects.filter(numero_retiro=numero).exists():
                return numero

    def __str__(self):
        return f"Pedido {self.numero_retiro}"

class DetallePedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='detalles')
    pizza = models.ForeignKey(Pizza, on_delete=models.CASCADE)
    cantidad = models.IntegerField(default=1)
    ingredientes_adicionales = models.ManyToManyField(Ingrediente, blank=True)
    oregano = models.BooleanField(default=False)
    instrucciones = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.pizza.get_nombre_display()} - Pedido {self.pedido.numero_retiro}"

class Promocion(models.Model):
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField()
    imagen = models.ImageField(upload_to='promociones/', null=True, blank=True)
    activa = models.BooleanField(default=True)

    def __str__(self):
        return self.titulo