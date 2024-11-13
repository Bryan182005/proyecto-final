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
    const mensajeProcesando = document.getElementById("mensaje-procesando"); 
    let compraEnProceso = false;

    
    const productosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
    
    const envioDomicilioSeleccionado = localStorage.getItem("envioDomicilio") === "true";

    
    function calcularCargoDomicilio() {
        return envioDomicilioSeleccionado ? 15000 : 0;
    }

    
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
                <td><button class="eliminar-btn" data-index="${index}">Eliminar</button></td>
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

        const botonesEliminar = document.querySelectorAll(".eliminar-btn");
        botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", function () {
            const index = parseInt(this.dataset.index);
            eliminarProducto(index);
        });
    });

        return { totalCantidad, totalPrecio, totalConCargo };
    }

        window.eliminarProducto = function (index) {
        console.log("Eliminando producto con índice:", index); 
        productosCarrito.splice(index, 1); 
        localStorage.setItem("carrito", JSON.stringify(productosCarrito)); 
        renderizarTabla(); 
    };
    renderizarTabla();

        numeroTarjeta.addEventListener("input", function () {
        
        let tarjetaSinEspacios = numeroTarjeta.value.replace(/\D/g, "");
    
        
        if (tarjetaSinEspacios.length > 19) {
            tarjetaSinEspacios = tarjetaSinEspacios.slice(0, 19);
        }
    
        
        const tarjetaFormateada = tarjetaSinEspacios.replace(/(\d{4})(?=\d)/g, "$1 ");
    
        
        const cursorPosition = numeroTarjeta.selectionStart;
    
        
        numeroTarjeta.value = tarjetaFormateada;
    
        
        numeroTarjeta.setSelectionRange(cursorPosition, cursorPosition);
    });
    
    

    
    fechaExpiracion.addEventListener("input", function () {
        if (fechaExpiracion.value.length === 2 && !fechaExpiracion.value.includes("/")) {
            fechaExpiracion.value += "/";
        }
    });

    
    mostrarCodigoBtn.addEventListener("click", function () {
        if (codigoSeguridad.type === "password") {
            codigoSeguridad.type = "text";
            mostrarCodigoBtn.textContent = "🙈";
        } else {
            codigoSeguridad.type = "password";
            mostrarCodigoBtn.textContent = "👁️";
        }
    });

    
    limpiarCamposBtn.addEventListener("click", function () {
        origenTarjeta.reset();
    });

    
    function mostrarMensajeProcesando() {
        mensajeProcesando.style.display = "block";
    }
    function ocultarMensajeProcesando() {
        mensajeProcesando.style.display = "none";
    }

    
    function inhabilitarBotones() {
        confirmarCompra.disabled = true;
        compraEnProceso = true;
        mostrarMensajeProcesando();
    }

    
    function validarCompra() {
        const { totalCantidad, totalPrecio } = renderizarTabla();
        
        if (totalCantidad > 20) {
            return "La cantidad de productos no debe sobrepasar los 20.";
        }
        if (totalPrecio > 1000000000000) { 
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
        
        return null; 
    }
    const confirmarcompra = document.getElementById("ejecutar-compra");
    confirmarcompra.addEventListener("click",procesarCompra);
    
function procesarCompra() {
    return new Promise((resolve, reject) => {
        mostrarMensajeProcesando(); 
        
        setTimeout(() => {
            ocultarMensajeProcesando(); 

            
            const exito = Math.random() > 0.2; 
            
            if (exito) {
                resolve("Pago realizado con éxito.");
            } else {
                reject("Hubo un error al procesar el pago.");
            }
        }, Math.floor(Math.random() * 1000) + 2000); 
    });
}


origenTarjeta.addEventListener("submit", function (event) {
    event.preventDefault();

    
    const error = validarCompra();
    if (error) {
        alert(error);
        return;
    }

    
    if (compraEnProceso) {
        alert("La compra ya está en proceso, por favor espere.");
        return;
    }

    confirmarCompra.disabled = true; 
    compraEnProceso = true; 

    inhabilitarBotones();

    
    procesarCompra()
        .then((mensajeExito) => {
            alert(mensajeExito); 
            origenTarjeta.reset(); 
            window.location.href = "index.html"; 
        })
        .catch((error) => {
            alert(error);
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
