document.addEventListener("DOMContentLoaded", function () {
    const tablaProductos = document.getElementById("tabla-productos");
    const totalProductos = document.getElementById("total-productos");
    const totalCompra = document.getElementById("total-compra");
    const cargoDomicilio = document.getElementById("cargo-domicilio");
    const totalFinal = document.getElementById("total");
    const origenTarjeta = document.getElementById("origen-tarjeta");
    const numeroTarjeta = document.getElementById("numero-tarjeta");
    const fechaExpiracion = document.getElementById("fecha-expiracion");
    const codigoSeguridad = document.getElementById("codigo-seguridad");
    const mostrarCodigoBtn = document.getElementById("mostrar-codigo");
    const nombreTitular = document.getElementById("nombre-titular");
    const tipoTarjeta = document.getElementsByName("tipo-tarjeta");
    const limpiarCamposBtn = document.getElementById("limpiar-campos");
    const confirmarCompra = document.getElementById("ejecutar-compra");
    const mensajeProcesando = document.getElementById("mensaje-procesando"); // Mensaje de "Procesando compra..."
    let compraEnProceso = false;

    // Obtener el carrito desde localStorage
    const productosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
    // Leer la selección de envío a domicilio de localStorage
    const envioDomicilioSeleccionado = localStorage.getItem("envioDomicilio") === "true";

    // Función para calcular el cargo de domicilio
    function calcularCargoDomicilio() {
        return envioDomicilioSeleccionado ? 15000 : 0;
    }

    // Renderizar la tabla de productos y calcular total
    function renderizarTabla() {
        tablaProductos.innerHTML = "";
        let totalCantidad = 0;
        let totalPrecio = 0;
    
        productosCarrito.forEach((producto, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${producto.nombre}</td>
                <td><img src="${producto.imagen}" alt="${producto.nombre}" width="50"></td>
                <td>${producto.precio}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.categoria}</td>
                <td>${producto.medidas}</td>
                <td><button onclick="eliminarProducto(${index})">Eliminar</button></td>
            `;
            tablaProductos.appendChild(row);
    
            let precioNumerico = parseFloat(producto.precio.replace(/[^0-9,]+/g, "").replace(/,/g, ""));
            totalCantidad += producto.cantidad;
            totalPrecio += producto.cantidad * precioNumerico;
        });
    
        totalProductos.textContent = `Total de productos: ${totalCantidad}`;
        totalCompra.textContent = `Total de la compra: $${totalPrecio.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;
        
        const cargo = calcularCargoDomicilio();
        cargoDomicilio.textContent = `Cargo por domicilio: $${cargo.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;
        const totalConCargo = totalPrecio + cargo;
        totalFinal.textContent = `Total: $${totalConCargo.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;

        return { totalCantidad, totalPrecio, totalConCargo };
    }

    window.eliminarProducto = function(index) {
        productosCarrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(productosCarrito));
        renderizarTabla();
    };

    renderizarTabla();

        numeroTarjeta.addEventListener("input", function () {
        // Eliminar todos los caracteres que no sean dígitos
        let tarjetaSinEspacios = numeroTarjeta.value.replace(/\D/g, "");
    
        // Limitar el número de dígitos a 19
        if (tarjetaSinEspacios.length > 19) {
            tarjetaSinEspacios = tarjetaSinEspacios.slice(0, 19);
        }
    
        // Formatear el número de tarjeta con espacios: XXXX XXXX XXXX XXXX XXX
        const tarjetaFormateada = tarjetaSinEspacios.replace(/(\d{4})(?=\d)/g, "$1 ");
    
        // Guardar la posición del cursor antes de actualizar el valor
        const cursorPosition = numeroTarjeta.selectionStart;
    
        // Actualizar el valor del input con el número formateado
        numeroTarjeta.value = tarjetaFormateada;
    
        // Restaurar la posición del cursor después de formatear
        numeroTarjeta.setSelectionRange(cursorPosition, cursorPosition);
    });
    
    

    // Validación de fecha de expiración en formato MM/AA
    fechaExpiracion.addEventListener("input", function () {
        if (fechaExpiracion.value.length === 2 && !fechaExpiracion.value.includes("/")) {
            fechaExpiracion.value += "/";
        }
    });

    // Mostrar y ocultar código de seguridad
    mostrarCodigoBtn.addEventListener("click", function () {
        if (codigoSeguridad.type === "password") {
            codigoSeguridad.type = "text";
            mostrarCodigoBtn.textContent = "🙈";
        } else {
            codigoSeguridad.type = "password";
            mostrarCodigoBtn.textContent = "👁️";
        }
    });

    // Limpiar campos del formulario
    limpiarCamposBtn.addEventListener("click", function () {
        origenTarjeta.reset();
    });

    // Mostrar y ocultar el mensaje de "Procesando compra..."
    function mostrarMensajeProcesando() {
        mensajeProcesando.style.display = "block";
    }
    function ocultarMensajeProcesando() {
        mensajeProcesando.style.display = "none";
    }

    // Inhabilitar y habilitar el botón de confirmación
    function inhabilitarBotones() {
        confirmarCompra.disabled = true;
        compraEnProceso = true;
        mostrarMensajeProcesando();
    }

    // Validación de la compra
    function validarCompra() {
        const { totalCantidad, totalPrecio } = renderizarTabla();
        
        if (totalCantidad > 20) {
            return "La cantidad de productos no debe sobrepasar los 20.";
        }
        if (totalPrecio > 1000000000000) { // Ejemplo de límite de presupuesto
            return "El presupuesto fue sobrepasado.";
        }
        if (!numeroTarjeta.value || numeroTarjeta.value.length !== 19) {
            return "Número de tarjeta inválido (debe ser de 19 dígitos).";
        }
        if (!fechaExpiracion.value.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
            return "Fecha de expiración inválida (MM/AA).";
        }
        if (!codigoSeguridad.value || codigoSeguridad.value.length !== 3) {
            return "Código de seguridad inválido (debe ser de 3 dígitos).";
        }
        if (!nombreTitular.value) {
            return "El nombre del titular es requerido.";
        }
        if (!Array.from(tipoTarjeta).some(radio => radio.checked)) {
            return "Debe seleccionar un tipo de tarjeta.";
        }
        
        return null; // No hay errores
    }
    const confirmarcompra = document.getElementById("ejecutar-compra");
    confirmarcompra.addEventListener("click",procesarCompra);
    // Función de simulación de compra
function procesarCompra() {
    return new Promise((resolve, reject) => {
        mostrarMensajeProcesando(); // Mostrar mensaje de "Procesando compra..."
        
        setTimeout(() => {
            ocultarMensajeProcesando(); // Oculta el mensaje "Procesando compra..." al finalizar

            // Simulamos el resultado del procesamiento de pago
            const exito = Math.random() > 0.2; // 80% de probabilidad de éxito
            
            if (exito) {
                resolve("Pago realizado con éxito.");
            } else {
                reject("Hubo un error al procesar el pago.");
            }
        }, Math.floor(Math.random() * 1000) + 2000); // Tiempo aleatorio entre 2 y 3 segundos
    });
}

// Manejador de envío del formulario
origenTarjeta.addEventListener("submit", function (event) {
    event.preventDefault();

    // Validación de la compra
    const error = validarCompra();
    if (error) {
        alert(error);
        return;
    }

    // Verificar si la compra ya está en proceso
    if (compraEnProceso) {
        alert("La compra ya está en proceso, por favor espere.");
        return;
    }

    confirmarCompra.disabled = true; // Inhabilitar el botón para evitar múltiples envíos
    compraEnProceso = true; // Marcar el proceso de compra como activo

    inhabilitarBotones();

    // Llamar a la función de procesamiento de compra
    procesarCompra()
        .then((mensajeExito) => {
            alert(mensajeExito); // Mostrar mensaje de éxito después de ocultar "Procesando compra..."
            origenTarjeta.reset(); // Limpiar el formulario tras éxito
            window.location.href = "index.html"; // Redirigir a la página principal
        })
        .catch((error) => {
            alert(error); // Mostrar error si el pago falla
        })
});
});

const regresar = document.getElementById("botonRegresar");

regresar.addEventListener("click",irvista2);

function irvista2(){
    window.location.href = "buscar.html";
}

const cancelar = document.getElementById("botonCancelar");

cancelar.addEventListener("click",irvista1);

function irvista1(){
    window.location.href = "index.html";
}
