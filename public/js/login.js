document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-login");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(form).entries());

    if (!datos.t1 || !datos.t4 || !datos.t5) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos obligatorios."
      });
      return;
    }

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });

      const respuesta = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Bienvenido!",
          text: respuesta.mensaje
        }).then(() => {
          window.location.href = "/perfil.html";
        });
      } else {
        const mensaje = respuesta.error?.toLowerCase().includes("rol")
          ? "Acceso denegado: tu cuenta no tiene permisos de administrador."
          : respuesta.error || "Credenciales incorrectas.";

        Swal.fire({
          icon: "error",
          title: "Error",
          text: mensaje
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