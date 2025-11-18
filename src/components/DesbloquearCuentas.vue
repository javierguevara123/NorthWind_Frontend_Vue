<template>
  <div class="container-fluid py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-xl-10">
        <h2 class="text-center fw-bold mb-4 gradient-title">
          <i class="fas fa-unlock me-2"></i>Desbloqueo de Cuentas
        </h2>

        <div class="card modern-card">
          <div class="card-header bg-gradient-danger">
            <h5 class="card-title text-white mb-0">
              <i class="fas fa-users-slash me-2"></i>Usuarios Bloqueados
              <span class="badge bg-light text-dark ms-2">{{
                usuarios.length
              }}</span>
            </h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover modern-table">
                <thead class="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Cédula</th>
                    <th>Correo</th>
                    <th>Intentos Fallidos</th>
                    <th>Estado</th>
                    <th class="text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(user, index) in usuarios"
                    :key="user.id"
                    class="table-row"
                  >
                    <td>{{ index + 1 }}</td>
                    <td>{{ user.cedula }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.accessFailedCount }}</td>
                    <td>
                      <span
                        :class="[
                          'badge',
                          user.isBlocked ? 'bg-danger' : 'bg-success',
                        ]"
                      >
                        {{ user.isBlocked ? "Bloqueado" : "Activo" }}
                      </span>
                    </td>
                    <td class="text-center">
                      <button
                        v-if="user.isBlocked"
                        class="btn btn-warning btn-sm"
                        @click="desbloquearUsuario(user.id)"
                        :disabled="loading"
                      >
                        <i class="fas fa-unlock me-1"></i> Desbloquear
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div
                v-if="usuarios.length === 0"
                class="text-center text-muted mt-3"
              >
                No hay usuarios bloqueados.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DesbloquearCuentas",
  data() {
    return {
      usuarios: [],
      loading: false,
    };
  },
  mounted() {
    this.obtenerUsuariosBloqueados();
  },
  methods: {
    async obtenerUsuariosBloqueados() {
      try {
        this.loading = true;
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5265/api/Auth/usuarios", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener usuarios");

        const data = await res.json();

        // Solo los que están bloqueados según el nuevo campo isBlocked
        this.usuarios = data.filter((u) => u.isBlocked === true);
      } catch (error) {
        console.error("Error:", error);
        alert("No se pudieron cargar los usuarios bloqueados");
      } finally {
        this.loading = false;
      }
    },

    async desbloquearUsuario(userId) {
      if (!confirm("¿Estás seguro de desbloquear esta cuenta?")) return;

      try {
        this.loading = true;
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:5265/api/Auth/lockout/${userId}?lockUser=false`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Error al desbloquear usuario");

        alert("Cuenta desbloqueada exitosamente");
        this.obtenerUsuariosBloqueados();
      } catch (error) {
        console.error("Error:", error);
        alert("No se pudo desbloquear la cuenta");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.gradient-title {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.bg-gradient-danger {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
}
.badge {
  font-size: 0.8rem;
  padding: 0.4rem 0.75rem;
  border-radius: 50px;
  font-weight: 600;
}
.table-dark {
  background: linear-gradient(135deg, #2c3e50, #34495e);
  color: white;
}
.table-row:hover {
  background-color: #f4f6fa;
}
.modern-card {
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.5s ease;
  border: none;
}
.btn-warning {
  border-radius: 50px;
  font-weight: bold;
}
</style>
