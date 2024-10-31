//Boton para ir a la paginas de productos
const iniciar = document.getElementById("iniciar")

iniciar.addEventListener("click",iniciarCompra)

function iniciarCompra() {
    window.location.href = "buscar.html"; // Reemplaza con la URL de tu siguiente página
  }

  //Boton para limpiar los campos de requerimiento
  const limpiar = document.getElementById("limpiar")

  limpiar.addEventListener("click",limpiarCampos)
  
  function limpiarCampos() {
    document.getElementById("nombre").value = "";
    document.getElementById("presupuesto").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("direccion").value = "";
    document.querySelectorAll('input[name="entrega"]').forEach((radio) => {
      radio.checked = false;
    });
  }