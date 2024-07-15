// main.js

document.addEventListener('DOMContentLoaded', function() {
    actualizarContadorCarrito();
    inicializarTooltips();
    animarElementosEnViewport();
    manejarScrollSuave();
    manejarCambioEstiloNavbar();
    
    if (document.querySelector('.home-page')) {
        inicializarPaginaInicio();
    }

    inicializarCarruselOfertas();
});

function agregarAlCarrito(item) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(item);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    mostrarMensaje(`${item.producto} agregado al carrito`, 'alert-success');
}

function actualizarContadorCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let contadorElement = document.getElementById('contador-carrito');
    if (contadorElement) {
        contadorElement.textContent = carrito.length;
    }
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

function inicializarTooltips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
}

function animarElementosEnViewport() {
    const elementos = document.querySelectorAll('.animar-entrada');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animado');
            }
        });
    });

    elementos.forEach(elemento => {
        observer.observe(elemento);
    });
}

function manejarScrollSuave() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

function manejarCambioEstiloNavbar() {
    const navbar = document.querySelector('.custom-navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }
}

function inicializarPaginaInicio() {
    const botonesOrdenar = document.querySelectorAll('.btn-ordenar');
    botonesOrdenar.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            const producto = this.getAttribute('data-producto');
            const precio = parseInt(this.getAttribute('data-precio'));
            agregarAlCarrito({producto, precio});
        });
    });
}

function inicializarCarruselOfertas() {
    var ofertasCarousel = new bootstrap.Carousel(document.getElementById('ofertasCarousel'), {
        interval: 5000,
        wrap: true
    });
}