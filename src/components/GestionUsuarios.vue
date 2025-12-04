<template>
  <div class="full-screen-page">
    <div class="overlay">
      
      <div class="container-fluid py-5">
        <div class="row justify-content-center">
          <div class="col-12 col-xl-10">
            
            <div class="mb-4">
              <router-link to="/menuPrincipal" class="btn btn-light btn-sm modern-btn text-muted" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                <i class="fas fa-arrow-left me-2"></i>Volver
              </router-link>
            </div>

            <h2 class="text-center fw-bold mb-5 gradient-title">
              <i class="fas fa-users me-3"></i>Gestión de Usuarios
            </h2>

            <div class="card modern-card mb-5">
              <div class="card-header bg-gradient-primary">
                <h5 class="card-title text-white mb-0">
                  <i class="fas fa-user-plus me-2"></i>Nuevo Usuario
                </h5>
              </div>
              <div class="card-body">
                <form @submit.prevent="crearUsuario">
                  <div class="row g-4">
                    <div class="col-md-6">
                      <div class="form-floating">
                        <input v-model="nuevoUsuario.firstName" type="text" class="form-control modern-input" id="firstName" placeholder="Nombre" required />
                        <label for="firstName"><i class="fas fa-user me-2"></i>Nombre</label>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-floating">
                        <input v-model="nuevoUsuario.lastName" type="text" class="form-control modern-input" id="lastName" placeholder="Apellido" required />
                        <label for="lastName"><i class="fas fa-user me-2"></i>Apellido</label>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-floating">
                        <input v-model="nuevoUsuario.cedula" type="text" class="form-control modern-input" id="cedula" placeholder="Cédula" required maxlength="10" />
                        <label for="cedula"><i class="fas fa-id-card me-2"></i>Cédula</label>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-floating">
                        <input v-model="nuevoUsuario.email" type="email" class="form-control modern-input" id="email" placeholder="Correo" required />
                        <label for="email"><i class="fas fa-envelope me-2"></i>Correo Electrónico</label>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-floating">
                        <input v-model="nuevoUsuario.password" type="password" class="form-control modern-input" id="password" placeholder="Contraseña" required />
                        <label for="password"><i class="fas fa-lock me-2"></i>Contraseña</label>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-floating">
                        <select v-model="nuevoUsuario.role" class="form-select modern-input" id="role" required>
                          <option value="">Seleccionar Rol</option>
                          <option value="Administrator">Administrador</option>
                          <option value="Employee">Empleado</option>
                          <option value="SuperUser">Super Usuario</option>
                        </select>
                        <label for="role"><i class="fas fa-user-tag me-2"></i>Rol</label>
                      </div>
                    </div>
                    <div class="col-12 text-end">
                      <button type="submit" class="btn btn-success modern-btn" :disabled="loading">
                        <i class="fas fa-plus me-2"></i>
                        <span v-if="loading">Procesando...</span>
                        <span v-else>Crear Usuario</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div class="card modern-card">
              <div class="card-header bg-gradient-info d-flex justify-content-between align-items-center">
                <h5 class="card-title text-white mb-0">
                  <i class="fas fa-list me-2"></i>Lista de Usuarios
                  <span class="badge bg-light text-dark ms-2">{{ paginacion.totalCount }}</span>
                </h5>
                <div class="d-flex align-items-center">
                  <span class="text-white me-2 small">Mostrar:</span>
                  <select v-model="paginacion.pageSize" @change="cambiarPagina(1)" class="form-select form-select-sm modern-input py-1" style="width: auto; background-color: rgba(255,255,255,0.9);">
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="20">20</option>
                    <option :value="50">50</option>
                  </select>
                </div>
              </div>
              
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover modern-table">
                    <thead class="table-dark">
                      <tr>
                        <th class="text-center">#</th>
                        <th><i class="fas fa-id-card me-2"></i>Cédula</th>
                        <th><i class="fas fa-user me-2"></i>Nombre</th>
                        <th><i class="fas fa-envelope me-2"></i>Correo</th>
                        <th><i class="fas fa-user-tag me-2"></i>Rol</th>
                        <th class="text-center"><i class="fas fa-cogs me-2"></i>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="usuarios.length === 0">
                        <td colspan="6" class="text-center py-4 text-muted">
                          No hay usuarios registrados o no se pudieron cargar.
                        </td>
                      </tr>
                      <tr v-for="(user, index) in usuarios" :key="user.id" class="table-row">
                        <td class="text-center fw-bold">
                          {{ (paginacion.pageNumber - 1) * paginacion.pageSize + index + 1 }}
                        </td>
                        <td><span class="user-info">{{ user.cedula }}</span></td>
                        <td><span>{{ user.firstName }} {{ user.lastName }}</span></td>
                        <td><span class="user-email">{{ user.email }}</span></td>
                        <td>
                          <span class="badge" :class="esAdmin(user.role) ? 'bg-warning text-dark' : 'bg-info'">
                            <i :class="esAdmin(user.role) ? 'fas fa-crown' : 'fas fa-user'" class="me-1"></i>
                            {{ user.role }}
                          </span>
                        </td>
                        <td class="text-center">
                          <div class="action-buttons">
                            <button class="btn-action btn-edit" @click="editar(user)" :disabled="loading" title="Editar">
                              <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn-action btn-delete" @click="confirmarEliminacion(user)" :disabled="loading" title="Eliminar">
                              <i class="fas fa-trash"></i> Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="d-flex justify-content-between align-items-center mt-4" v-if="paginacion.totalPages > 0">
                  <div class="text-muted small">
                    Mostrando página {{ paginacion.pageNumber }} de {{ paginacion.totalPages }}
                  </div>
                  <nav aria-label="Navegación de usuarios">
                    <ul class="pagination pagination-modern mb-0">
                      <li class="page-item" :class="{ disabled: !paginacion.hasPreviousPage }">
                        <button class="page-link" @click="cambiarPagina(paginacion.pageNumber - 1)">
                          <i class="fas fa-chevron-left"></i>
                        </button>
                      </li>
                      <li v-for="page in paginacion.totalPages" :key="page" class="page-item" :class="{ active: page === paginacion.pageNumber }">
                        <button v-if="mostrarPagina(page)" class="page-link" @click="cambiarPagina(page)">
                          {{ page }}
                        </button>
                      </li>
                      <li class="page-item" :class="{ disabled: !paginacion.hasNextPage }">
                        <button class="page-link" @click="cambiarPagina(paginacion.pageNumber + 1)">
                          <i class="fas fa-chevron-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div> 
  </div>

  <Teleport to="body">
    
    <div class="modal fade" ref="editarModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
      <div class="modal-dialog modal-lg">
        <div class="modal-content modern-modal">
          <form @submit.prevent="actualizarUsuario">
            <div class="modal-header bg-gradient-primary">
              <h5 class="modal-title text-white"><i class="fas fa-user-edit me-2"></i>Editar Usuario</h5>
              <button type="button" class="btn-close btn-close-white" @click="cerrarModal"></button>
            </div>
            <div class="modal-body">
              
              <div v-if="loadingData" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2 text-muted">Cargando datos...</p>
              </div>

              <div v-else class="row g-3">
                <div class="col-md-6">
                  <div class="form-floating">
                    <input v-model="usuarioEdit.firstName" class="form-control modern-input" id="editFirstName" placeholder="Nombre" required />
                    <label for="editFirstName">Nombre</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating">
                    <input v-model="usuarioEdit.lastName" class="form-control modern-input" id="editLastName" placeholder="Apellido" required />
                    <label for="editLastName">Apellido</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating">
                    <input v-model="usuarioEdit.cedula" class="form-control modern-input" id="editCedula" placeholder="Cédula" required maxlength="10"/>
                    <label for="editCedula">Cédula</label>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating">
                    <input 
                      v-model="usuarioEdit.email" 
                      class="form-control modern-input" 
                      id="editEmail" 
                      type="email" 
                      placeholder="Correo" 
                      required 
                    />
                    <label for="editEmail">Correo Electrónico (Editable)</label>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-floating">
                    <select v-model="usuarioEdit.role" class="form-select modern-input" id="editRole" required>
                      <option value="Administrator">Administrador</option>
                      <option value="Employee">Empleado</option>
                      <option value="SuperUser">Super Usuario</option>
                    </select>
                    <label for="editRole">Rol</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary modern-btn" :disabled="loading || loadingData">Guardar Cambios</button>
              <button type="button" class="btn btn-secondary modern-btn" @click="cerrarModal">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal fade" ref="confirmarModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content modern-modal">
          <div class="modal-header bg-gradient-danger">
            <h5 class="modal-title text-white">Confirmar Eliminación</h5>
            <button type="button" class="btn-close btn-close-white" @click="cerrarConfirmacion"></button>
          </div>
          <div class="modal-body text-center">
            <div class="mb-3"><i class="fas fa-user-times fa-3x text-danger"></i></div>
            <h6>¿Eliminar usuario?</h6>
            <p class="text-muted" v-if="usuarioAEliminar"><strong>{{ usuarioAEliminar.email }}</strong></p>
            <small class="text-danger">Esta acción no se puede deshacer.</small>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger modern-btn" @click="eliminarUsuario" :disabled="loading">Eliminar</button>
            <button type="button" class="btn btn-secondary modern-btn" @click="cerrarConfirmacion">Cancelar</button>
          </div>
        </div>
      </div>
    </div>

  </Teleport>
</template>

<script>
// IMPORTANTE: Importamos Modal directamente de bootstrap para asegurar que funcione
import { Modal } from 'bootstrap';

export default {
  data() {
    return {
      usuarios: [],
      paginacion: {
        pageNumber: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false
      },
      nuevoUsuario: { 
          firstName: "", lastName: "", cedula: "", email: "", password: "", role: "" 
      },
      usuarioEdit: {
    id: "", 
    firstName: "", 
    lastName: "", 
    cedula: "", 
    email: "", 
    originalEmail: "", // NUEVO: Para guardar el email antiguo
    role: "", 
    originalRole: "",
    password: "" // Para la nueva contraseña opcional
},
      usuarioAEliminar: null,
      editarModalInstance: null,
      confirmarModalInstance: null,
      loading: false,
      loadingData: false
    };
  },
  mounted() {
    this.obtenerUsuarios();
    // Inicializamos los modales usando Refs y la librería importada
    this.inicializarModales();
  },
  methods: {
    inicializarModales() {
      // Creamos las instancias usando la clase Modal importada
      if (this.$refs.editarModal) {
        this.editarModalInstance = new Modal(this.$refs.editarModal);
      }
      if (this.$refs.confirmarModal) {
        this.confirmarModalInstance = new Modal(this.$refs.confirmarModal);
      }
    },
    mostrarPagina(page) {
        const actual = this.paginacion.pageNumber;
        return page === 1 || page === this.paginacion.totalPages || (page >= actual - 2 && page <= actual + 2);
    },
    esAdmin(rol) {
        return rol === 'Admin' || rol === 'Administrator' || rol === 'SuperUser';
    },
    async cambiarPagina(nuevaPagina) {
        if (nuevaPagina < 1 || nuevaPagina > this.paginacion.totalPages) return;
        this.paginacion.pageNumber = nuevaPagina;
        await this.obtenerUsuarios();
    },

    // 1. OBTENER USUARIOS
    async obtenerUsuarios() {
      try {
        this.loading = true;
        const token = localStorage.getItem("token");
        const queryParams = new URLSearchParams({
            pageNumber: this.paginacion.pageNumber,
            pageSize: this.paginacion.pageSize
        }).toString();
        
        const url = `https://localhost:7176/user/GetAllUsers?${queryParams}`;

        const res = await fetch(url, {
          headers: { 'accept': '*/*', 'Authorization': `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Error al obtener usuarios");
        const data = await res.json();
        
        this.paginacion.totalCount = data.totalCount;
        this.paginacion.totalPages = data.totalPages;
        this.paginacion.hasPreviousPage = data.hasPreviousPage;
        this.paginacion.hasNextPage = data.hasNextPage;

        this.usuarios = data.items.map((u) => ({
          id: u.id,
          cedula: u.cedula,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          role: u.roles && u.roles.length > 0 ? u.roles[0] : 'Employee', 
        }));
      } catch (error) {
        console.error("Error:", error);
        this.mostrarNotificacion("Error al cargar usuarios", "error");
      } finally {
        this.loading = false;
      }
    },

    // 2. CREAR USUARIO
    async crearUsuario() {
        if(!this.validarUsuario()) return;
        try {
            this.loading = true;
            const token = localStorage.getItem("token");
            
            // A) Registrar
            const resRegister = await fetch("https://localhost:7176/user/Register", {
                method: "POST", 
                headers: { "Content-Type": "application/json", "accept": "*/*", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({
                    email: this.nuevoUsuario.email.trim(),
                    password: this.nuevoUsuario.password,
                    firstName: this.nuevoUsuario.firstName.trim(),
                    lastName: this.nuevoUsuario.lastName.trim(),
                    cedula: this.nuevoUsuario.cedula.trim()
                })
            });

            if (!resRegister.ok) {
                 const data = await resRegister.json();
                 let msg = "Error al registrar";
                 if(data.errors && Array.isArray(data.errors)) msg = data.errors.map(e => e.errorMessage).join(", ");
                 else if(data.detail) msg = data.detail;
                 throw new Error(msg);
            }

            // B) Asignar Rol
            const resRole = await fetch("https://localhost:7176/user/ChangeUserRole", {
                method: "POST",
                headers: { "Content-Type": "application/json", "accept": "*/*", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({
                    email: this.nuevoUsuario.email.trim(),
                    newRole: this.nuevoUsuario.role
                })
            });

            if (resRole.ok) this.mostrarNotificacion("Usuario creado exitosamente.", "success");
            else this.mostrarNotificacion("Usuario creado, error al asignar rol.", "warning");

            this.nuevoUsuario = { firstName: "", lastName: "", cedula: "", email: "", password: "", role: "" };
            await this.obtenerUsuarios();

        } catch (error) { 
            console.error(error);
            this.mostrarNotificacion(error.message || "Error de conexión", "error"); 
        } finally { 
            this.loading = false; 
        }
    },

    validarUsuario() {
        const { email, password, cedula, firstName, lastName, role } = this.nuevoUsuario;
        const errores = [];
        if (!firstName) errores.push("Nombre requerido");
        if (!lastName) errores.push("Apellido requerido");
        if (!email) errores.push("Email requerido");
        if (!cedula) errores.push("Cédula requerida");
        if (!password) errores.push("Password requerido");
        if (!role) errores.push("Rol requerido");
        if (errores.length > 0) {
            this.mostrarNotificacion(errores.join("\n"), "error");
            return false;
        }
        return true;
    },

    // 3. EDITAR USUARIO
    async editar(user) {
        this.loadingData = true;
        this.editarModalInstance?.show();
        
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`https://localhost:7176/api/users/${user.id}`, {
                 headers: { Authorization: `Bearer ${token}` },
            });
            
            const data = await res.json(); 

            if (!res.ok || !data.success) {
                 this.cerrarModal(); 
                 return this.mostrarNotificacion(data.message || "Error al obtener datos", "error");
            }
            
            this.usuarioEdit = {
                id: data.user.id,
                firstName: data.user.firstName,
                lastName: data.user.lastName,
                cedula: data.user.cedula,
                email: data.user.email,
                originalEmail: data.user.email, // GUARDAMOS EL EMAIL ACTUAL COMO REFERENCIA
                role: data.user.role,
                originalRole: data.user.role,
                password: "" // Limpio para que no se actualice si no escriben nada
            };
            
        } catch (error) { 
            console.error(error);
            this.cerrarModal();
            this.mostrarNotificacion("Error de conexión", "error"); 
        } finally { 
            this.loadingData = false; 
        }
    },

    cerrarModal() { this.editarModalInstance?.hide(); this.usuarioEdit = {}; },

    // 4. ACTUALIZAR USUARIO
    async actualizarUsuario() {
         try {
            this.loading = true;
            const token = localStorage.getItem("token");

            // Construimos el JSON tal cual lo pide el CURL
            const payloadUpdate = {
                currentUserEmail: this.usuarioEdit.originalEmail, // IDENTIFICADOR (Email viejo)
                email: this.usuarioEdit.email,                    // NUEVO VALOR (Email nuevo)
                firstName: this.usuarioEdit.firstName,
                lastName: this.usuarioEdit.lastName,
                cedula: this.usuarioEdit.cedula,
                // Solo enviamos password si el usuario escribió algo
                newPassword: this.usuarioEdit.password ? this.usuarioEdit.password : null 
            };

            console.log("Enviando payload:", payloadUpdate); // Para debug

            const resUpdate = await fetch(`https://localhost:7176/user/UpdateUser`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json", 
                    "accept": "*/*",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(payloadUpdate),
            });

            if (!resUpdate.ok) {
                const data = await resUpdate.json();
                let msg = "Error al actualizar datos";
                
                // Manejo de errores estándar
                if (data.errors) {
                    if (Array.isArray(data.errors)) msg = data.errors.map(e => e.errorMessage).join(", ");
                    else msg = Object.values(data.errors).flat().join(", ");
                } else if (data.message) {
                    msg = data.message;
                }
                
                throw new Error(msg);
            }

            // Validar cambio de rol (Usamos el email nuevo por si cambió)
            if (this.usuarioEdit.role !== this.usuarioEdit.originalRole) {
                const resRole = await fetch("https://localhost:7176/user/ChangeUserRole", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify({
                        email: this.usuarioEdit.email, // Usamos el email (posiblemente nuevo)
                        newRole: this.usuarioEdit.role
                    })
                });
                
                if (!resRole.ok) {
                    this.mostrarNotificacion("Datos guardados, pero error al cambiar rol.", "warning");
                    await this.obtenerUsuarios();
                    this.cerrarModal();
                    return;
                }
            }

            await this.obtenerUsuarios();
            this.mostrarNotificacion("Usuario actualizado exitosamente", "success");
            this.cerrarModal();

        } catch (error) { 
            console.error(error);
            this.mostrarNotificacion(error.message || "Error de conexión", "error"); 
        } finally { 
            this.loading = false; 
        }
    },

    // 5. ELIMINAR
    confirmarEliminacion(user) { 
        console.log("Intentando eliminar:", user); // DEBUG
        this.usuarioAEliminar = user; 
        this.confirmarModalInstance?.show(); 
    },
    
    cerrarConfirmacion() { this.confirmarModalInstance?.hide(); this.usuarioAEliminar = null; },

    async eliminarUsuario() {
        if (!this.usuarioAEliminar) return;
        try {
            this.loading = true;
            const token = localStorage.getItem("token");
            const emailParam = encodeURIComponent(this.usuarioAEliminar.email);
            const url = `https://localhost:7176/user/DeleteUser?email=${emailParam}`;

            const res = await fetch(url, {
                method: "DELETE", 
                headers: { "accept": "*/*", "Authorization": `Bearer ${token}` },
            });

            if (res.ok) {
                this.mostrarNotificacion("Usuario eliminado exitosamente", "success");
                this.cerrarConfirmacion();
                await this.obtenerUsuarios();
            } else {
                let errorMsg = "Error al eliminar";
                try {
                    const errorData = await res.json();
                    errorMsg = errorData.message || errorData.detail || errorMsg;
                } catch { errorMsg = await res.text() || errorMsg; }
                this.mostrarNotificacion(errorMsg, "error");
            }
        } catch (error) { 
            console.error(error);
            this.mostrarNotificacion("Error de conexión", "error"); 
        } finally { 
            this.loading = false; 
        }
    },

    mostrarNotificacion(mensaje, tipo = "info") {
      const alertClass = tipo === "success" ? "alert-success" : tipo === "error" ? "alert-danger" : "alert-warning";
      const notification = document.createElement("div");
      notification.className = `alert ${alertClass} alert-dismissible fade show position-fixed`;
      notification.style.cssText = "top: 20px; right: 20px; z-index: 1055; min-width: 300px;";
      notification.innerHTML = `${mensaje}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 5000);
    },
  },
};
</script>

<style scoped>
/* =========================================
   ESTILOS
========================================= */
.full-screen-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url("https://img.freepik.com/vector-gratis/fondo-minimalista-gradiente_23-2149976755.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1000;
}
.overlay {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: rgba(245, 247, 250, 0.85);
  padding-bottom: 50px;
}
.container-fluid { background: transparent; min-height: auto; }
.gradient-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.bg-gradient-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.bg-gradient-info { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.bg-gradient-danger { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); }
.modern-card {
  border: none; border-radius: 20px; background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); overflow: hidden; transition: all 0.3s ease;
}
.modern-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); }
.modern-card .card-header { border: none; padding: 1.5rem; }
.modern-card .card-body { padding: 2rem; }
.modern-input {
  border-radius: 15px; border: 2px solid #e9ecef; transition: all 0.3s ease;
  padding: 0.75rem 1rem; background-color: #fff;
}
.modern-input:focus { border-color: #667eea; box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25); transform: translateY(-2px); }
.form-floating > .modern-input:focus ~ label, .form-floating > .modern-input:not(:placeholder-shown) ~ label { color: #667eea; }
.modern-btn {
  border-radius: 50px; padding: 0.75rem 2rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.5px; transition: all 0.3s ease; border: none; position: relative; overflow: hidden;
}
.modern-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); }
.action-buttons { display: flex; gap: 8px; justify-content: center; align-items: center; }
.btn-action {
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px;
  border: none; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer;
  transition: all 0.2s ease; min-width: 70px; justify-content: center;
}
.btn-edit { background-color: #ff9500; color: white; }
.btn-edit:hover:not(:disabled) { background-color: #e8890b; transform: translateY(-1px); box-shadow: 0 2px 4px rgba(255, 149, 0, 0.3); }
.btn-delete { background-color: #dc3545; color: white; }
.btn-delete:hover:not(:disabled) { background-color: #c82333; transform: translateY(-1px); box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3); }
.modern-table { border-radius: 15px; overflow: hidden; border: none; background-color: white; }
.modern-table .table-dark { background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); }
.table-row:hover { background-color: rgba(102, 126, 234, 0.1); }
.user-info { font-weight: 600; color: #2c3e50; }
.user-email { color: #667eea; font-size: 0.9rem; }
.pagination-modern .page-item .page-link {
  border: none; border-radius: 50%; width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center; margin: 0 4px;
  color: #2c3e50; font-weight: 600; background-color: transparent; transition: all 0.3s ease;
}
.pagination-modern .page-item .page-link:hover { background-color: rgba(102, 126, 234, 0.1); color: #667eea; }
.pagination-modern .page-item.active .page-link { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3); }
.modern-modal { border-radius: 20px; border: none; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); background: white; }
.modern-modal .modal-header { border: none; padding: 1.5rem 2rem; }
.modern-modal .modal-body { padding: 2rem; }
.modern-modal .modal-footer { border: none; padding: 1.5rem 2rem; background-color: #f8f9fa; }
.badge { font-size: 0.75rem; padding: 0.5rem 1rem; border-radius: 50px; font-weight: 600; }
.overlay::-webkit-scrollbar { width: 8px; }
.overlay::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); }
.overlay::-webkit-scrollbar-thumb { background: rgba(102, 126, 234, 0.5); border-radius: 10px; }
.overlay::-webkit-scrollbar-thumb:hover { background: rgba(102, 126, 234, 0.8); }
</style>