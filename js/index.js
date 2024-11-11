// Botón para ir a la página de productos
const iniciar = document.getElementById("iniciar");

iniciar.addEventListener("click", iniciarCompra);

function iniciarCompra() {
  // Limpiar mensajes de error previos
  limpiarMensajesDeError();

  // Obtener los valores de los campos
  const campos = [
    { id: "nombre", nombre: "Nombre del Comprador", tipo: "texto", maxLength: 20 },
    { id: "presupuesto", nombre: "Alcance de Presupuesto", tipo: "numero", formato: "moneda" },
    { id: "cantidad", nombre: "Cantidad de Artículos Máxima", tipo: "numero", maxValue: 20 },
    { id: "direccion", nombre: "Dirección" }
  ];

  let hayCampoVacio = false;

  // Validar cada campo según las especificaciones
  for (let i = 0; i < campos.length; i++) {
    const campo = campos[i];
    const elemento = document.getElementById(campo.id);
    const valor = elemento.value.trim();

    // Validar campo vacío
    if (!valor) {
      mostrarMensajeDeError(campo.id, "El campo " +campo.nombre+ " está vacío");
      hayCampoVacio = true;
    } else {
      // Validación específica para cada campo
      if (campo.tipo === "texto" && campo.maxLength && valor.length > campo.maxLength) {
        mostrarMensajeDeError(campo.id, "El campo " +campo.nombre+" no debe superar los " +campo.maxLength+ " caracteres");
        hayCampoVacio = true;
      } else if (campo.tipo === "numero") {
        const valorNumerico = parseFloat(valor);
        if (isNaN(valorNumerico) || valorNumerico <= 0) {
          mostrarMensajeDeError(campo.id, "El campo "+campo.nombre+" debe ser un número positivo");
          hayCampoVacio = true;
        } else if (campo.maxValue && valorNumerico > campo.maxValue) {
          mostrarMensajeDeError(campo.id, "El campo "+campo.nombre+" no debe ser mayor a " +campo.maxValue);
          hayCampoVacio = true;
        }
        // Formatear campo de presupuesto en pesos
        if (campo.formato === "moneda") {
          elemento.value = valorNumerico.toFixed(2); // Formato en pesos
        }
      }
    }
  }

  // Validar selección de tipo de entrega
  const entregaSeleccionada = document.querySelector('input[name="entrega"]:checked');
  if (!entregaSeleccionada) {
    mostrarMensajeDeError("entrega", "Debe seleccionar un tipo de entrega");
    hayCampoVacio = true;
  }

  // Si todos los campos están completos y cumplen las validaciones, redirigir a la siguiente página
  if (!hayCampoVacio) {
    window.location.href = "buscar.html"; // Reemplaza con la URL de tu siguiente página
  }
}

// Función para mostrar un mensaje de error debajo de un campo
function mostrarMensajeDeError(id, mensaje) {
  const elemento = document.getElementById(id);
  const mensajeError = document.createElement("p");
  mensajeError.textContent = mensaje;
  mensajeError.style.color = "red";
  mensajeError.style.fontSize = "0.9em";
  mensajeError.classList.add("mensaje-error");

  // Insertar el mensaje justo después del elemento de entrada
  elemento.parentNode.insertBefore(mensajeError, elemento.nextSibling);
}

// Función para limpiar mensajes de error previos
function limpiarMensajesDeError() {
  const mensajesDeError = document.querySelectorAll(".mensaje-error");
  mensajesDeError.forEach(mensaje => mensaje.remove());
}

// Botón para limpiar los campos de requerimiento
const limpiar = document.getElementById("limpiar");

limpiar.addEventListener("click", limpiarCampos);

function limpiarCampos() {
  document.getElementById("nombre").value = "";
  document.getElementById("presupuesto").value = "";
  document.getElementById("cantidad").value = "";
  document.getElementById("direccion").value = "";
  document.querySelectorAll('input[name="entrega"]').forEach((radio) => {
    radio.checked = false;
  });

  limpiarMensajesDeError();
}

const iniciarCompraBtn = document.getElementById("iniciar");
if (iniciarCompraBtn) {
    iniciarCompraBtn.addEventListener("click", guardarSeleccionEnvio);
}


// Función para manejar la selección de envío en la vista #1
function guardarSeleccionEnvio() {
  const entregaSeleccionada = document.querySelector('input[name="entrega"]:checked');
  if (entregaSeleccionada) {
      localStorage.setItem("envioDomicilio", entregaSeleccionada.value === "domicilio");
  }
}
