class PerfilManager {
  constructor() {
    this.token = this.getToken();
    this.correo = this.getCorreo();
    this.datosOriginales = {};
    this.editando = false;

    this.init();
  }

  init() {
    this.verificarSesion();
    this.cargarPerfil();
    this.asignarEventos();
  }

  getToken() {
    return localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  }

  getCorreo() {
    return localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
  }

  async verificarSesion() {
    if (!this.token) {
      this.redirigirLogin();
      return;
    }

    try {
      const res = await fetch("/verificar-sesion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ token: this.token }),
      });

      const json = await res.json();
      if (!json.mensaje) this.redirigirLogin();
    } catch (err) {
      console.error("Error al verificar sesión", err);
      this.redirigirLogin();
    }
  }

  redirigirLogin() {
    localStorage.clear();
    sessionStorage.clear();

    // Comentado temporalmente para pruebas de interfaz
    // window.location.href = "/";
    console.warn("Sesión inválida o token faltante. Redirección desactivada temporalmente para pruebas.");
  }

  async cargarPerfil() {
    try {
      this.mostrarCargando(true);

      const res = await fetch("/perfil/obtener", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ correo: this.correo }),
      });

      const json = await res.json();

      if (json.exito) {
        this.llenarFormulario(json.datos);
        this.datosOriginales = { ...json.datos };
      } else {
        this.notificar("Error al obtener el perfil", "error");
        if (res.status === 401) this.redirigirLogin();
      }
    } catch (error) {
      console.error("Error de conexión", error);
      this.notificar("Error de conexión al cargar el perfil", "error");
    } finally {
      this.mostrarCargando(false);
    }
  }

  llenarFormulario(data) {
    const campos = [
      "documento",
      "nombreCompleto",
      "telefono",
      "correo",
      "direccion",
      "fechaexpedicion",
      "respuesta1",
      "respuesta2",
      "respuesta3",
    ];

    campos.forEach((campo) => {
      const input = document.getElementById(campo);
      if (input) input.value = data[campo] || "";
    });

    const documento = document.getElementById("documento");
    if (documento) documento.readOnly = true;
  }

  asignarEventos() {
    document.getElementById("editBtn")?.addEventListener("click", () => this.habilitarEdicion(true));
    document.getElementById("cancelBtn")?.addEventListener("click", () => this.cancelarCambios());
    document.getElementById("profileForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.actualizarPerfil();
    });

    document.getElementById("logout")?.addEventListener("click", () => this.logout());
    document.getElementById("notificationClose")?.addEventListener("click", () => this.ocultarNotificacion());

    document.querySelectorAll(".nav-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        this.mostrarSeccion(item.dataset.section);
        document.querySelectorAll(".nav-item").forEach((i) => i.classList.remove("active"));
        item.classList.add("active");
      });
    });
  }

  habilitarEdicion(estado) {
    this.editando = estado;

    const camposEditables = [
      "nombreCompleto",
      "telefono",
      "correo",
      "direccion",
      "fechaexpedicion",
      "respuesta1",
      "respuesta2",
      "respuesta3",
    ];

    camposEditables.forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        input.readOnly = !estado;
        input.classList.toggle("editable", estado);
      }
    });

    document.getElementById("formActions").style.display = estado ? "flex" : "none";
    document.getElementById("editBtn").style.display = estado ? "none" : "block";
  }

  cancelarCambios() {
    this.llenarFormulario(this.datosOriginales);
    this.habilitarEdicion(false);
  }

  async actualizarPerfil() {
    const data = {
      documento: document.getElementById("documento").value.trim(),
      nombreCompleto: document.getElementById("nombreCompleto").value.trim(),
      telefono: document.getElementById("telefono").value.trim(),
      correo: document.getElementById("correo").value.trim(),
      direccion: document.getElementById("direccion").value.trim(),
      fechaexpedicion: document.getElementById("fechaexpedicion").value.trim(),
      respuesta1: document.getElementById("respuesta1").value.trim(),
      respuesta2: document.getElementById("respuesta2").value.trim(),
      respuesta3: document.getElementById("respuesta3").value.trim(),
    };

    try {
      this.mostrarCargando(true);

      const res = await fetch("/perfil/actualizar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (json.exito) {
        this.datosOriginales = { ...data };
        this.notificar("Perfil actualizado correctamente", "success");
        localStorage.setItem("userEmail", data.correo);
        this.habilitarEdicion(false);
      } else {
        this.notificar("No se pudo actualizar el perfil", "error");
      }
    } catch (err) {
      console.error("Error al actualizar perfil", err);
      this.notificar("Error al conectar con el servidor", "error");
    } finally {
      this.mostrarCargando(false);
    }
  }

  logout() {
    if (!confirm("¿Seguro que deseas cerrar sesión?")) return;

    fetch("/logout-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    }).finally(() => {
      localStorage.clear();
      sessionStorage.clear();
      this.notificar("Sesión cerrada", "success");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    });
  }

  mostrarSeccion(id) {
    document.querySelectorAll(".content-section").forEach((s) => s.classList.remove("active"));
    const seccion = document.getElementById(`${id}Section`);
    if (seccion) seccion.classList.add("active");
  }

  mostrarCargando(estado) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.classList.toggle("show", estado);
  }

  notificar(mensaje, tipo = "info") {
    const contenedor = document.getElementById("notification");
    const mensajeElemento = document.getElementById("notificationMessage");

    if (contenedor && mensajeElemento) {
      mensajeElemento.textContent = mensaje;
      contenedor.className = `notification show ${tipo}`;
      setTimeout(() => this.ocultarNotificacion(), 4000);
    }
  }

  ocultarNotificacion() {
    const contenedor = document.getElementById("notification");
    if (contenedor) contenedor.classList.remove("show");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.perfilManager = new PerfilManager();
});

window.addEventListener("beforeunload", (e) => {
  if (window.perfilManager?.editando) {
    e.preventDefault();
    e.returnValue = "Tienes cambios sin guardar. ¿Salir de todos modos?";
  }
});