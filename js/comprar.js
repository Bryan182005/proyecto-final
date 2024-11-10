document.addEventListener("DOMContentLoaded", function () {
    const tablaProductos = document.getElementById("tabla-productos");
    const totalProductos = document.getElementById("total-productos");
    const totalCompra = document.getElementById("total-compra");
    const cargoDomicilio = document.getElementById("cargo-domicilio");

    // Obtener el carrito desde localStorage
    const productosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

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
    
            // Convertir el precio a número eliminando símbolos y separadores de miles
            let precioNumerico = parseFloat(producto.precio.replace(/[^0-9,]+/g, "").replace(/,/g, ""));
            
            totalCantidad += producto.cantidad;
            totalPrecio += producto.cantidad * precioNumerico; // Multiplica cantidad por precio limpio
        });
    
        totalProductos.textContent = `Total de productos: ${totalCantidad}`;
        totalCompra.textContent = `Total de la compra: $${totalPrecio.toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;
    
        // Cargo de domicilio si el total supera un cierto monto (ejemplo: $10 por encima de $100)
        const cargo = totalPrecio > 100 ? 10 : 0;
        cargoDomicilio.textContent = `Cargo por domicilio: $${cargo.toFixed(2)}`;
    }
    

    window.eliminarProducto = function(index) {
        productosCarrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(productosCarrito));
        renderizarTabla();
    };

    renderizarTabla();

    const regresar = document.getElementById("botonRegresar");

    regresar.addEventListener("click", regresarvista2);

    function regresarvista2() 
    {
        window.location.href = "buscar.html";
    }

    const cancelar = document.getElementById("botonCancelar");

    cancelar.addEventListener("click", regresarvista1);

    function regresarvista1() 
    {
        window.location.href = "index.html";
    }

    const formTarjeta = document.getElementById("form-tarjeta");
    formTarjeta.addEventListener("submit", function (event) {
        event.preventDefault();
        alert("Compra ejecutada con éxito. Gracias por su compra!");
        localStorage.removeItem("carrito");
    });
});
