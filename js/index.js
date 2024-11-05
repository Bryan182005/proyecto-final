// Botón para ir a la página de productos
const iniciar = document.getElementById("iniciar");

iniciar.addEventListener("click", iniciarCompra);

function iniciarCompra() {
  // Limpiar mensajes de error previos
  limpiarMensajesDeError();

  // Obtener los valores de los campos
  const campos = [
    { id: "nombre", nombre: "Nombre del Comprador" },
    { id: "presupuesto", nombre: "Alcance de Presupuesto" },
    { id: "cantidad", nombre: "Cantidad de Artículos Máxima" },
    { id: "direccion", nombre: "Dirección" }
  ];

  let hayCampoVacio = false;

  // Validar si algún campo está vacío y mostrar el mensaje debajo del campo vacío
  for (let i = 0; i < campos.length; i++) {
    const campo = campos[i];
    const valor = document.getElementById(campo.id).value.trim();
    if (!valor) {
      mostrarMensajeDeError(campo.id, `El campo "${campo.nombre}" está vacío`);
      hayCampoVacio = true;
    }
  }

  const entregaSeleccionada = document.querySelector('input[name="entrega"]:checked');
  if (!entregaSeleccionada) {
    mostrarMensajeDeError("entrega", "Debe seleccionar un tipo de entrega");
    hayCampoVacio = true;
  }

  // Si todos los campos están completos, redirigir a la siguiente página
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
