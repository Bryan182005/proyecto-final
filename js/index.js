function iniciarCompra() {
    window.location.href = "buscar.html"; // Reemplaza con la URL de tu siguiente página
  }
  
  function limpiarCampos() {
    document.getElementById("nombre").value = "";
    document.getElementById("presupuesto").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("direccion").value = "";
    document.querySelectorAll('input[name="entrega"]').forEach((radio) => {
      radio.checked = false;
    });
  }