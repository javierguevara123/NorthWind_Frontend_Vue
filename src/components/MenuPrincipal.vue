<template>
  <div class="menu-page d-flex flex-column min-vh-100">
    <!-- Barra superior fija -->
    <header class="header-bar d-flex align-items-center justify-content-between px-4 shadow-sm">
      <div class="d-flex align-items-center gap-3">
        <img
          :src="`https://i.pravatar.cc/48?u=${userEmail}`"
          alt="Avatar usuario"
          class="avatar"
        />
        <div class="user-info">
          <div class="user-email">{{ userEmail }}</div>
          <router-link to="/perfil" class="btn btn-sm btn-outline-primary perfil-btn">
            Ver Perfil
          </router-link>
        </div>
      </div>

      <button class="btn btn-danger btn-sm btn-logout" @click="logout">
        <i class="bi bi-box-arrow-right"></i> Cerrar sesión
      </button>
    </header>

    <!-- Contenido principal -->
    <main class="flex-grow-1 d-flex flex-column justify-content-center align-items-center px-4 py-5">
      <h1 class="mb-3 text-primary fw-bold text-center">Menú Principal - Usuario</h1>

      <p class="mb-5 fs-5 text-secondary text-center max-w-700">
        ¡Bienvenido al portal de compras y facturación! Aquí puedes explorar productos, consultar tus facturas y realizar nuevas facturaciones de manera rápida y segura.
      </p>

      <div class="menu-grid w-100 max-w-700">
        <router-link
          to="/selectProductos"
          class="menu-card d-flex flex-column align-items-center justify-content-center text-center text-decoration-none text-dark shadow-sm"
        >
          <i class="bi bi-box-seam fs-1 mb-3 text-primary"></i>
          <span class="fs-5 fw-semibold">Listado de Productos</span>
        </router-link>

        <router-link
          to="/facturas"
          class="menu-card d-flex flex-column align-items-center justify-content-center text-center text-decoration-none text-dark shadow-sm"
        >
          <i class="bi bi-receipt fs-1 mb-3 text-info"></i>
          <span class="fs-5 fw-semibold">Listado de Facturas</span>
        </router-link>

        <router-link
          to="/order"
          class="menu-card d-flex flex-column align-items-center justify-content-center text-center text-decoration-none text-dark shadow-sm"
        >
          <i class="bi bi-currency-dollar fs-1 mb-3 text-success"></i>
          <span class="fs-5 fw-semibold">Realizar Facturación</span>
        </router-link>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "MenuPrincipal",
  data() {
    return {
      userEmail: localStorage.getItem("email") || "",
    };
  },
  mounted() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "Usuario") {
      this.$router.push("/login");
    }
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    },
    volverMenu() {
      this.$router.push('/menu'); // O '/menuPrincipal' según tu configuración
    },
  },
};
</script>

<style scoped>
.menu-page {
  background: linear-gradient(135deg, #f0f4f8, #e0e7ff);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Barra superior fija */
.header-bar {
  background-color: white;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
  position: sticky;
  top: 0;
  z-index: 1100;
  box-shadow: 0 1px 6px rgb(0 0 0 / 0.1);
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0d6efd;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-email {
  font-weight: 600;
  color: #212529;
}

.perfil-btn {
  font-size: 0.85rem;
  margin-top: 0.15rem;
  padding: 0.25rem 0.6rem;
}

.btn-logout {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

/* Contenido principal */
main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  text-align: center;
}

/* Limitar ancho para mejor lectura */
.max-w-700 {
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

/* Grid para las opciones del menú */
/* Fuerza 3 columnas para que los cuadros estén en la misma fila si hay espacio */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
}

/* Tarjetas cuadradas */
.menu-card {
  background-color: white;
  border-radius: 12px;
  padding: 2.5rem 1.5rem;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.menu-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgb(0 0 0 / 0.15);
}

.menu-card i {
  user-select: none;
}

.menu-card span {
  user-select: none;
}
</style>
