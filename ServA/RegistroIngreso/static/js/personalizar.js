// personalizar.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('personalizar-pizza-form');
    const ingredientesCheckboxes = document.querySelectorAll('input[name="ingredientes"]');
    const precioTotalSpan = document.getElementById('precio-total');
    const instruccionesTextarea = document.getElementById('instrucciones');
    const maxIngredientes = 5;
    const maxCaracteres = 200;

    function actualizarPrecio() {
        let precioBase = 5500;
        let ingredientesSeleccionados = document.querySelectorAll('input[name="ingredientes"]:checked').length;
        let precioTotal = precioBase + (ingredientesSeleccionados * 2500);
        precioTotalSpan.textContent = precioTotal;
    }

    function validarIngredientes() {
        let ingredientesSeleccionados = document.querySelectorAll('input[name="ingredientes"]:checked').length;
        if (ingredientesSeleccionados === 0) {
            mostrarError('Debes seleccionar al menos un ingrediente.');
            return false;
        }
        if (ingredientesSeleccionados > maxIngredientes) {
            mostrarError(`Puedes seleccionar un máximo de ${maxIngredientes} ingredientes.`);
            return false;
        }
        return true;
    }

    function validarInstrucciones() {
        if (instruccionesTextarea.value.length > maxCaracteres) {
            mostrarError(`Las instrucciones especiales no pueden exceder los ${maxCaracteres} caracteres.`);
            return false;
        }
        return true;
    }

    function mostrarError(mensaje) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        errorDiv.textContent = mensaje;
        form.insertBefore(errorDiv, form.firstChild);
        setTimeout(() => errorDiv.remove(), 3000);
    }

    ingredientesCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', actualizarPrecio);
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (!validarIngredientes() || !validarInstrucciones()) {
            return;
        }

        const ingredientes = Array.from(document.querySelectorAll('input[name="ingredientes"]:checked')).map(el => el.value);
        const oregano = document.getElementById('oregano').checked;
        const instrucciones = instruccionesTextarea.value;
        const precioTotal = parseInt(precioTotalSpan.textContent);

        const pizzaPersonalizada = {
            producto: 'Pizza personalizada',
            ingredientes: ingredientes,
            oregano: oregano,
            instrucciones: instrucciones,
            precio: precioTotal
        };

        agregarAlCarrito(pizzaPersonalizada);
        mostrarMensaje('Pizza personalizada agregada al carrito', 'alert-success');
        form.reset();
        actualizarPrecio();
    });

    // Inicializar el precio
    actualizarPrecio();
});

function mostrarMensaje(mensaje, tipo = 'alert-info') {
    const mensajeElement = document.createElement('div');
    mensajeElement.textContent = mensaje;
    mensajeElement.className = `alert ${tipo} mensaje-flotante`;
    document.body.appendChild(mensajeElement);

    setTimeout(() => {
        mensajeElement.remove();
    }, 3000);
}

// Esta función debe estar definida en main.js, pero la incluimos aquí por si acaso
function agregarAlCarrito(item) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(item);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

// Esta función también debe estar en main.js, pero la incluimos por si acaso
function actualizarContadorCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let contadorElement = document.getElementById('contador-carrito');
    if (contadorElement) {
        contadorElement.textContent = carrito.length;
    }
}