from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
import json
from .models import Pedido, DetallePedido, Pizza, Ingrediente
import logging

logger = logging.getLogger(__name__)

@require_POST
@csrf_exempt
def realizar_pedido(request):
    try:
        data = json.loads(request.body)
        
        # Validaciones
        if not data.get('rut') or not data.get('telefono'):
            raise ValidationError("RUT y teléfono son obligatorios")
        
        if not data.get('items') or len(data['items']) == 0:
            raise ValidationError("El carrito está vacío")

        pedido = Pedido.objects.create(
            rut=data['rut'],
            telefono=data['telefono']
        )
        
        for item in data['items']:
            try:
                pizza = Pizza.objects.get(nombre=item['producto'])
            except Pizza.DoesNotExist:
                raise ValidationError(f"La pizza '{item['producto']}' no existe")

            detalle = DetallePedido.objects.create(
                pedido=pedido,
                pizza=pizza,
                cantidad=item.get('cantidad', 1),
                oregano=item.get('oregano', False),
                instrucciones=item.get('instrucciones', '')
            )
            
            if 'ingredientes' in item and item['ingredientes']:
                ingredientes = Ingrediente.objects.filter(nombre__in=item['ingredientes'])
                detalle.ingredientes_adicionales.add(*ingredientes)
        
        return JsonResponse({
            'success': True, 
            'numero_pedido': pedido.numero_retiro
        })
    except ValidationError as e:
        return JsonResponse({
            'success': False, 
            'error': str(e)
        }, status=400)
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False, 
            'error': "Error en el formato de los datos enviados"
        }, status=400)
    except Exception as e:
        logger.error(f"Error inesperado al procesar pedido: {str(e)}")
        return JsonResponse({
            'success': False, 
            'error': "Ocurrió un error inesperado. Por favor, intente más tarde."
        }, status=500)

def home_index(request):
    return render(request, 'index.html')

def carrito(request):
    return render(request, 'carrito.html')

def personalizar(request):
    return render(request, 'personalizar.html')


