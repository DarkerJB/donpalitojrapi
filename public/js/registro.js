document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-registro");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(form).entries());

    if (!datos.t1 || !datos.t2 || !datos.t3 || !datos.t4 || !datos.t5) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos obligatorios."
      });
      return;
    }

    try {
      const res = await fetch("/api/admin/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });

      const respuesta = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Registro exitoso!",
          text: respuesta.mensaje
        }).then(() => {
          window.location.href = "/login.html";
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: respuesta.error || "No se pudo completar el registro."
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de red",
        text: error.message
      });
    }
  });
});