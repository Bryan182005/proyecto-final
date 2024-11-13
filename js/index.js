
const iniciar = document.getElementById("iniciar");

iniciar.addEventListener("click", iniciarCompra);

function iniciarCompra() {
  
  limpiarMensajesDeError();

 
  const campos = [
    { id: "nombre", nombre: "Nombre del Comprador", tipo: "texto", maxLength: 20 },
    { id: "presupuesto", nombre: "Alcance de Presupuesto", tipo: "numero", formato: "moneda" },
    { id: "cantidad", nombre: "Cantidad de Artículos Máxima", tipo: "numero", maxValue: 20 },
    { id: "direccion", nombre: "Dirección" }
  ];

  let hayCampoVacio = false;

  
  for (let i = 0; i < campos.length; i++) {
    const campo = campos[i];
    const elemento = document.getElementById(campo.id);
    const valor = elemento.value.trim();

    
    if (!valor) {
      mostrarMensajeDeError(campo.id, "El campo " +campo.nombre+ " está vacío");
      hayCampoVacio = true;
    } else {
      
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
        
        if (campo.formato === "moneda") {
          elemento.value = valorNumerico.toFixed(2); 
        }
      }
    }
  }

  
  const entregaSeleccionada = document.querySelector('input[name="entrega"]:checked');
  if (!entregaSeleccionada) {
    mostrarMensajeDeError("entrega", "Debe seleccionar un tipo de entrega");
    hayCampoVacio = true;
  }

  
  if (!hayCampoVacio) {
    window.location.href = "buscar.html"; 
  }
}


function mostrarMensajeDeError(id, mensaje) {
  const elemento = document.getElementById(id);
  const mensajeError = document.createElement("p");
  mensajeError.textContent = mensaje;
  mensajeError.style.color = "red";
  mensajeError.style.fontSize = "0.9em";
  mensajeError.classList.add("mensaje-error");

  
  elemento.parentNode.insertBefore(mensajeError, elemento.nextSibling);
}


function limpiarMensajesDeError() {
  const mensajesDeError = document.querySelectorAll(".mensaje-error");
  mensajesDeError.forEach(mensaje => mensaje.remove());
}


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



function guardarSeleccionEnvio() {
  const entregaSeleccionada = document.querySelector('input[name="entrega"]:checked');
  if (entregaSeleccionada) {
      localStorage.setItem("envioDomicilio", entregaSeleccionada.value === "domicilio");
  }
}
