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
              <i class="fas fa-box-open me-3"></i>Gestión de Productos
            </h2>

            <div class="card modern-card mb-4">
              <div class="card-body p-4">
                <div class="row g-3 align-items-center">
                  <div class="col-md-10">
                    <div class="form-floating">
                      <input
                        v-model="filtroBusqueda"
                        @keyup.enter="buscarProductos"
                        type="text"
                        class="form-control modern-input"
                        id="buscador"
                        placeholder="Buscar..."
                      />
                      <label for="buscador"><i class="fas fa-search me-2"></i>Buscar producto...</label>
                    </div>
                  </div>
                  <div class="col-md-2 text-end">
                    <button class="btn btn-primary modern-btn w-100 h-100" @click="buscarProductos">
                      Buscar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="card modern-card mb-5">
              <div class="card-header bg-gradient-primary">
                <h5 class="card-title text-white mb-0">
                  <i class="fas fa-plus-circle me-2"></i>Nuevo Producto
                </h5>
              </div>
              <div class="card-body">
                <form @submit.prevent="crearProducto">
                  <div class="row g-4">
                    <div class="col-md-6">
                      <div class="form-floating">
                        <input v-model="nuevoProducto.name" type="text" class="form-control modern-input" id="newName" placeholder="Nombre" required />
                        <label for="newName">Nombre del Producto</label>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-floating">
                        <input v-model.number="nuevoProducto.unitPrice" type="number" step="0.01" class="form-control modern-input" id="newPrice" placeholder="Precio" required min="0"/>
                        <label for="newPrice">Precio Unitario</label>
                      </div>
                    </div>
                    <div class="col-md-3">
                      <div class="form-floating">
                        <input v-model.number="nuevoProducto.unitsInStock" type="number" class="form-control modern-input" id="newStock" placeholder="Stock" required min="0"/>
                        <label for="newStock">Stock Inicial</label>
                      </div>
                    </div>
                    <div class="col-12 text-end">
                      <button type="submit" class="btn btn-success modern-btn" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                        <i class="fas fa-save me-2"></i>Crear Producto
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div class="card modern-card">
              <div class="card-header bg-gradient-info d-flex justify-content-between align-items-center">
                <h5 class="card-title text-white mb-0">
                  <i class="fas fa-list me-2"></i>Lista de Productos
                  <span class="badge bg-light text-dark ms-2">{{ paginacion.totalCount }}</span>
                </h5>
                <div class="d-flex align-items-center">
                  <span class="text-white me-2 small">Mostrar:</span>
                  <select 
                    v-model="paginacion.pageSize" 
                    @change="cambiarTamanoPagina" 
                    class="form-select form-select-sm modern-input py-1" 
                    style="width: auto; background-color: rgba(255,255,255,0.9);"
                  >
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="20">20</option>
                  </select>
                </div>
              </div>
              
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover modern-table">
                    <thead class="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Valor Total</th>
                        <th class="text-center">Estado</th>
                        <th class="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="productos.length === 0">
                        <td colspan="7" class="text-center py-4 text-muted">
                          No se encontraron productos.
                        </td>
                      </tr>
                      <tr v-for="producto in productos" :key="producto.id" class="table-row">
                        <td class="fw-bold">{{ producto.id }}</td>
                        <td><span class="user-info">{{ producto.name }}</span></td>
                        <td>${{ producto.unitPrice ? producto.unitPrice.toFixed(2) : '0.00' }}</td>
                        <td>{{ producto.unitsInStock }}</td>
                        <td class="text-muted">${{ producto.totalValue ? producto.totalValue.toFixed(2) : '0.00' }}</td>
                        <td class="text-center">
                          <span class="badge" :class="producto.isLowStock ? 'bg-danger' : 'bg-success'">
                            {{ producto.isLowStock ? 'Bajo Stock' : 'Normal' }}
                          </span>
                        </td>
                        <td class="text-center">
                          <div class="action-buttons">
                            <button class="btn-action btn-edit" @click="prepararEdicion(producto)" :disabled="loading" title="Editar">
                              <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn-action btn-delete" @click="confirmarEliminacion(producto.id)" :disabled="loading" title="Eliminar">
                              <i class="fas fa-trash"></i> Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="d-flex justify-content-between align-items-center mt-4" v-if="totalPaginas > 0">
                  <div class="text-muted small">
                    Mostrando página {{ paginacion.pageNumber }} de {{ totalPaginas }}
                  </div>
                  <nav aria-label="Navegación">
                    <ul class="pagination pagination-modern mb-0">
                      <li class="page-item" :class="{ disabled: !paginacion.hasPreviousPage }">
                        <button class="page-link" @click="cambiarPagina(-1)">
                          <i class="fas fa-chevron-left"></i>
                        </button>
                      </li>
                      <li class="page-item active">
                        <button class="page-link">{{ paginacion.pageNumber }}</button>
                      </li>
                      <li class="page-item" :class="{ disabled: !paginacion.hasNextPage }">
                        <button class="page-link" @click="cambiarPagina(1)">
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
      <div class="modal-dialog">
        <div class="modal-content modern-modal">
          <div class="modal-header bg-gradient-primary">
            <h5 class="modal-title text-white"><i class="fas fa-edit me-2"></i>Editar Producto</h5>
            <button type="button" class="btn-close btn-close-white" @click="cerrarModalEditar"></button>
          </div>
          <div class="modal-body">
            
            <div v-if="loadingData" class="text-center py-4">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted">Cargando datos...</p>
            </div>

            <div v-else class="row g-3">
              <div class="col-12">
                <div class="form-floating">
                  <input v-model="productoEditado.id" type="text" class="form-control modern-input" id="editId" disabled style="background-color: #f0f0f0;" />
                  <label for="editId">ID (No editable)</label>
                </div>
              </div>
              <div class="col-12">
                <div class="form-floating">
                  <input v-model="productoEditado.name" type="text" class="form-control modern-input" id="editName" placeholder="Nombre" required />
                  <label for="editName">Nombre del Producto</label>
                </div>
              </div>
              <div class="col-6">
                <div class="form-floating">
                  <input v-model.number="productoEditado.unitPrice" type="number" step="0.01" class="form-control modern-input" id="editPrice" placeholder="Precio" required />
                  <label for="editPrice">Precio</label>
                </div>
              </div>
              <div class="col-6">
                <div class="form-floating">
                  <input v-model.number="productoEditado.unitsInStock" type="number" class="form-control modern-input" id="editStock" placeholder="Stock" required />
                  <label for="editStock">Stock</label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary modern-btn" :disabled="loading || loadingData" @click="guardarEdicion">Guardar Cambios</button>
            <button type="button" class="btn btn-secondary modern-btn" @click="cerrarModalEditar">Cancelar</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" ref="notifModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content modern-modal">
          <div :class="['modal-header', modal.tipo === 'error' || modal.tipo === 'confirmacion' ? 'bg-gradient-danger' : 'bg-gradient-primary']">
            <h5 class="modal-title text-white">
              <i :class="['fas', modal.tipo === 'exito' ? 'fa-check-circle' : modal.tipo === 'confirmacion' ? 'fa-question-circle' : 'fa-exclamation-triangle', 'me-2']"></i>
              {{ modal.tipo === 'exito' ? '¡Éxito!' : modal.tipo === 'confirmacion' ? 'Confirmar' : 'Atención' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="cerrarModalNotif"></button>
          </div>
          <div class="modal-body text-center">
            <p class="fs-5">{{ modal.mensaje }}</p>
          </div>
          <div class="modal-footer">
            <template v-if="modal.tipo === 'confirmacion'">
              <button type="button" class="btn btn-danger modern-btn" :disabled="loading" @click="ejecutarAccionConfirmada">Sí, Confirmar</button>
              <button type="button" class="btn btn-secondary modern-btn" @click="cerrarModalNotif">Cancelar</button>
            </template>
            <template v-else>
              <button type="button" class="btn btn-primary modern-btn" @click="cerrarModalNotif">Entendido</button>
            </template>
          </div>
        </div>
      </div>
    </div>

  </Teleport>
</template>

<script>
import { Modal } from 'bootstrap';

export default {
  name: "GestionProductos",
  data() {
    return {
      productos: [],
      filtroBusqueda: "",
      paginacion: {
        pageNumber: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false
      },
      nuevoProducto: {
        name: "",
        unitPrice: 0,
        unitsInStock: 0
      },
      productoEditado: {
        id: 0,
        name: "",
        unitPrice: 0,
        unitsInStock: 0
      },
      loading: false,
      loadingData: false,
      
      modal: {
        tipo: "", 
        mensaje: "",
        accion: null,
      },
      
      editarModalInstance: null,
      notifModalInstance: null,
    };
  },
  computed: {
    totalPaginas() {
      return this.paginacion.totalPages || Math.ceil(this.paginacion.totalCount / this.paginacion.pageSize) || 1;
    }
  },
  mounted() {
    this.cargarProductos();
    this.inicializarModales();
  },
  methods: {
    inicializarModales() {
      if (this.$refs.editarModal) this.editarModalInstance = new Modal(this.$refs.editarModal);
      if (this.$refs.notifModal) this.notifModalInstance = new Modal(this.$refs.notifModal);
    },

    // --- UTILS MODALES ---
    mostrarNotificacion(tipo, mensaje, accion = null) {
      this.modal = { tipo, mensaje, accion };
      this.notifModalInstance?.show();
    },
    cerrarModalNotif() {
      this.notifModalInstance?.hide();
      this.modal.accion = null;
    },
    ejecutarAccionConfirmada() {
      if (this.modal.accion) this.modal.accion();
    },
    cerrarModalEditar() {
      this.editarModalInstance?.hide();
      this.productoEditado = { id: 0, name: "", unitPrice: 0, unitsInStock: 0 };
    },

    // --- 1. LISTAR (GET /api/products) ---
    async cargarProductos() {
      this.loading = true;
      try {
        const token = localStorage.getItem("token");
        const params = new URLSearchParams({
            PageNumber: this.paginacion.pageNumber,
            PageSize: this.paginacion.pageSize,
            OrderDescending: false
        });

        if (this.filtroBusqueda) params.append("SearchTerm", this.filtroBusqueda);

        const url = `http://northwindweb.somee.com/api/products?${params.toString()}`;
        const res = await fetch(url, {
          headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Error al obtener datos");

        const data = await res.json();
        this.productos = data.items; 
        this.paginacion.totalCount = data.totalCount;
        this.paginacion.totalPages = data.totalPages;
        this.paginacion.hasPreviousPage = data.hasPreviousPage;
        this.paginacion.hasNextPage = data.hasNextPage;

      } catch (error) {
        console.error(error);
        this.mostrarNotificacion("error", "No se pudieron cargar los productos.");
      } finally {
        this.loading = false;
      }
    },

    buscarProductos() {
        this.paginacion.pageNumber = 1;
        this.cargarProductos();
    },
    
    cambiarPagina(delta) {
        const nuevaPagina = this.paginacion.pageNumber + delta;
        if (nuevaPagina > 0 && nuevaPagina <= this.totalPaginas) {
            this.paginacion.pageNumber = nuevaPagina;
            this.cargarProductos();
        }
    },

    cambiarTamanoPagina() {
        this.paginacion.pageNumber = 1;
        this.cargarProductos();
    },

    // --- 2. CREAR (POST /CreateProduct) ---
    async crearProducto() {
      if(!this.nuevoProducto.name || this.nuevoProducto.unitPrice < 0) {
          return this.mostrarNotificacion("error", "Nombre y precio válidos son requeridos");
      }

      this.loading = true;
      try {
          const token = localStorage.getItem("token");
          
          // Payload Limpio según Schema
          const payload = {
              name: this.nuevoProducto.name,
              unitsInStock: this.nuevoProducto.unitsInStock,
              unitPrice: this.nuevoProducto.unitPrice
          };

          const res = await fetch(`http://northwindweb.somee.com/CreateProduct`, {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify(payload)
          });

          // Manejo específico del error 403
          if (res.status === 403) {
              throw new Error("No tienes permisos (Rol insuficiente) para crear productos.");
          }

          if(res.ok || res.status === 201) {
              this.mostrarNotificacion("exito", "Producto creado exitosamente");
              this.nuevoProducto = { name: "", unitPrice: 0, unitsInStock: 0 };
              this.cargarProductos();
          } else {
              const text = await res.text();
              this.mostrarNotificacion("error", "Error al crear: " + text);
          }
      } catch (error) {
          this.mostrarNotificacion("error", error.message || "Error de conexión");
      } finally {
          this.loading = false;
      }
    },
    
    // --- 3. OBTENER DETALLE (GET /GetProductById/{id}) ---
    async prepararEdicion(producto) {
      this.loadingData = true;
      this.editarModalInstance?.show();
      
      try {
          const token = localStorage.getItem("token");
          const res = await fetch(`http://northwindweb.somee.com/GetProductById/${producto.id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          });

          if(res.ok) {
              const data = await res.json();
              this.productoEditado = {
                  id: data.id,
                  name: data.name,
                  unitsInStock: data.unitsInStock,
                  unitPrice: data.unitPrice
              };
          } else {
              this.cerrarModalEditar();
              this.mostrarNotificacion("error", "No se pudo obtener la información del producto.");
          }
      } catch(error) {
          this.cerrarModalEditar();
          this.mostrarNotificacion("error", "Error de conexión.");
      } finally {
          this.loadingData = false;
      }
    },

    // --- 4. ACTUALIZAR (PUT /UpdateProduct/{id}) ---
    async guardarEdicion() {
        this.loading = true;
        try {
            const token = localStorage.getItem("token");
            const payload = {
                productId: this.productoEditado.id,
                name: this.productoEditado.name,
                unitsInStock: this.productoEditado.unitsInStock,
                unitPrice: this.productoEditado.unitPrice
            };

            const res = await fetch(`http://northwindweb.somee.com/UpdateProduct/${this.productoEditado.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            if(res.ok) {
                this.cerrarModalEditar();
                this.mostrarNotificacion("exito", "Producto actualizado correctamente");
                this.cargarProductos();
            } else {
                this.mostrarNotificacion("error", "Error al actualizar producto.");
            }
        } catch(error) {
            this.mostrarNotificacion("error", "Error de conexión.");
        } finally {
            this.loading = false;
        }
    },

    // --- 5. ELIMINAR (DELETE /DeleteProduct/{id}) ---
    confirmarEliminacion(id) {
        this.mostrarNotificacion("confirmacion", `¿Estás seguro de eliminar el producto ID: ${id}?`, () => {
            this.eliminarProducto(id);
        });
    },

    async eliminarProducto(id) {
        this.cerrarModalNotif(); 
        
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://northwindweb.somee.com/DeleteProduct/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if(res.ok) {
                this.mostrarNotificacion("exito", "Producto eliminado correctamente");
                this.cargarProductos();
            } else {
                this.mostrarNotificacion("error", "Error al eliminar producto (posiblemente referenciado).");
            }
        } catch(error) {
            this.mostrarNotificacion("error", "Error de conexión.");
        }
    },
  }
};
</script>

<style scoped>
/* =========================================
   ESTILOS MODERNOS (Consistent)
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

/* Títulos y Cards */
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

/* Inputs y Botones */
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

/* Tabla */
.modern-table { border-radius: 15px; overflow: hidden; border: none; background-color: white; }
.modern-table .table-dark { background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); }
.table-row:hover { background-color: rgba(102, 126, 234, 0.1); }
.user-info { font-weight: 600; color: #2c3e50; }

.action-buttons { display: flex; gap: 8px; justify-content: center; align-items: center; }
.btn-action {
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px;
  border: none; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer;
  transition: all 0.2s ease; min-width: 70px; justify-content: center;
}
.btn-edit { background-color: #ff9500; color: white; }
.btn-edit:hover { background-color: #e8890b; transform: translateY(-1px); box-shadow: 0 2px 4px rgba(255, 149, 0, 0.3); }
.btn-delete { background-color: #dc3545; color: white; }
.btn-delete:hover { background-color: #c82333; transform: translateY(-1px); box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3); }

/* Paginación */
.pagination-modern .page-item .page-link {
  border: none; border-radius: 50%; width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center; margin: 0 4px;
  color: #2c3e50; font-weight: 600; background-color: transparent; transition: all 0.3s ease;
}
.pagination-modern .page-item .page-link:hover { background-color: rgba(102, 126, 234, 0.1); color: #667eea; }
.pagination-modern .page-item.active .page-link { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3); }

/* Modales */
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