<template>
  <div class="admin-page d-flex flex-column min-vh-100">
    
    <!-- Header fijo con usuario -->
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
      <h1 class="mb-3 text-gradient fw-bold text-center">Panel de Administración</h1>

      <div class="row g-4 w-100 max-w-900 justify-content-center">
        <div
          class="col-md-6 col-xl-3"
          v-for="card in adminCards"
          :key="card.title"
        >
          <div :class="`card h-100 shadow border-0 ${card.colorClass}`">
            <div
              class="card-body text-center text-white d-flex flex-column justify-content-between"
            >
              <div>
                <i :class="card.icon" class="display-4 mb-3"></i>
                <h5 class="fw-bold">{{ card.title }}</h5>
                <p class="small">{{ card.description }}</p>
              </div>
              <button
                class="btn btn-light btn-sm fw-bold"
                @click="goTo(card.route)"
              >
                Gestionar
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "MenuAdmin",
  data() {
    return {
      userEmail: localStorage.getItem("email") || "",
      adminCards: [
        {
          title: "Usuarios",
          description: "Gestión de usuarios registrados.",
          icon: "bi bi-people-fill",
          route: "/gestionUsuarios",
          colorClass: "bg-gradient-purple",
        },
        {
          title: "Clientes",
          description: "Gestión completa de clientes.",
          icon: "bi bi-person-lines-fill",
          route: "/gestionClientes",
          colorClass: "bg-gradient-blue",
        },
        {
          title: "Productos",
          description: "Gestión de artículos en tienda.",
          icon: "bi bi-bag-check-fill",
          route: "/productos",
          colorClass: "bg-gradient-orange",
        },
        {
          title: "Reportes",
          description: "Revisión de estadísticas y métricas.",
          icon: "bi bi-bar-chart-line-fill",
          route: "/reporteErrores",
          colorClass: "bg-gradient-green",
        },
        {
          title: "Desbloqueo",
          description: "Cuentas bloqueadas por intentos fallidos.",
          icon: "bi bi-unlock-fill",
          route: "/desbloquearCuentas",
          colorClass: "bg-gradient-cyan",
        },
      ],
    };
  },
  mounted() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "Admin") {
      this.$router.push("/login");
    }
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    },
    goTo(route) {
      this.$router.push(route);
    },
  },
};
</script>

<style scoped>
.admin-page {
  background: linear-gradient(to right, #fff1f8, #f0f9ff);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header fijo */
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

.text-gradient {
  background: linear-gradient(45deg, #7f00ff, #00c6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.max-w-900 {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

/* Tarjetas */
.bg-gradient-purple {
  background: linear-gradient(135deg, #7f00ff, #e100ff);
}

.bg-gradient-blue {
  background: linear-gradient(135deg, #2196f3, #6ec6ff);
}

.bg-gradient-orange {
  background: linear-gradient(135deg, #ff6a00, #ffb347);
}

.bg-gradient-green {
  background: linear-gradient(135deg, #00c853, #b2ff59);
}

.bg-gradient-cyan {
  background: linear-gradient(135deg, #00bcd4, #64ffda);
}

.card {
  transition: transform 0.3s ease;
  border-radius: 0.75rem;
}

.card:hover {
  transform: translateY(-5px);
}
</style>
