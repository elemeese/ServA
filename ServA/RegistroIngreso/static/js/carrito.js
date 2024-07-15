// carrito.js

document.addEventListener('DOMContentLoaded', function() {
    actualizarCarrito();
    
    const btnComprar = document.getElementById('btn-comprar');
    if (btnComprar) {
        btnComprar.addEventListener('click', mostrarFormularioCompra);
    }

    const compraForm = document.getElementById('compraForm');
    if (compraForm) {
        compraForm.addEventListener('submit', manejarSubmitCompra);
    }

    // Inicializar el modal de compra
    window.compraModal = new bootstrap.Modal(document.getElementById('compraModal'));
});

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarCarrito() {
    const carritoItems = document.getElementById('carrito-items');
    const totalCarrito = document.getElementById('total-carrito');
    const carrito = obtenerCarrito();
    
    carritoItems.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p class="text-center">Tu carrito está vacío</p>';
    } else {
        carrito.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('carrito-item', 'mb-2', 'd-flex', 'justify-content-between', 'align-items-center');
            
            let itemDetails = `<span>${item.producto} - $${item.precio}`;
            
            if (item.ingredientes) {
                itemDetails += `<br><small>Ingredientes: ${item.ingredientes.join(', ')}`;
                if (item.oregano) itemDetails += ', orégano';
                itemDetails += '</small>';
            }
            
            if (item.instrucciones) {
                itemDetails += `<br><small>Instrucciones: ${item.instrucciones}</small>`;
            }
            
            itemDetails += '</span>';
            
            itemElement.innerHTML = `
                ${itemDetails}
                <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${index})">Eliminar</button>
            `;
            
            carritoItems.appendChild(itemElement);
            total += item.precio;
        });
    }

    totalCarrito.textContent = total;
    actualizarContadorCarrito();
}

function eliminarDelCarrito(index) {
    let carrito = obtenerCarrito();
    carrito.splice(index, 1);
    guardarCarrito(carrito);
    actualizarCarrito();
    mostrarMensaje('Producto eliminado del carrito', 'alert-success');
}

function mostrarFormularioCompra() {
    console.log('Función mostrarFormularioCompra ejecutada');
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        mostrarMensaje('Tu carrito está vacío', 'alert-warning');
        return;
    }

    window.compraModal.show();
}

function manejarSubmitCompra(e) {
    e.preventDefault();
    const rut = document.getElementById('rut').value;
    const telefono = document.getElementById('telefono').value;
    const carrito = obtenerCarrito();

    const datos = {
        rut: rut,
        telefono: telefono,
        items: carrito.map(item => ({
            producto: item.producto,
            precio: item.precio,
            cantidad: 1, // Asumiendo que cada item es una unidad
            ingredientes: item.ingredientes,
            oregano: item.oregano,
            instrucciones: item.instrucciones
        }))
    };

    // Enviar los datos al backend
    fetch('/realizar-pedido/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Limpiar el carrito
            localStorage.removeItem('carrito');
            actualizarCarrito();
            
            // Cerrar el modal
            window.compraModal.hide();

            // Mostrar mensaje de éxito
            mostrarMensaje(`¡Gracias por tu compra! Tu número de pedido es: ${data.numero_pedido}`, 'alert-success');
        } else {
            mostrarMensaje('Hubo un error al procesar tu pedido. Por favor, intenta de nuevo.', 'alert-danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('Hubo un error al procesar tu pedido. Por favor, intenta de nuevo.', 'alert-danger');
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function mostrarMensaje(mensaje, tipo = 'alert-info') {
    const mensajeElement = document.createElement('div');
    mensajeElement.textContent = mensaje;
    mensajeElement.className = `alert ${tipo} mensaje-flotante`;
    document.body.appendChild(mensajeElement);

    setTimeout(() => {
        mensajeElement.remove();
    }, 3000);
}

function actualizarContadorCarrito() {
    let carrito = obtenerCarrito();
    let contadorElement = document.getElementById('contador-carrito');
    if (contadorElement) {
        contadorElement.textContent = carrito.length;
    }
}