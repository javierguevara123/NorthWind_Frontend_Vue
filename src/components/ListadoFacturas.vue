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
              <i class="fas fa-file-invoice-dollar me-3"></i>Historial de Facturas
            </h2>

            <div class="card modern-card mb-4">
              <div class="card-body p-4">
                <div class="row g-3 align-items-end">
                  
                  <div class="col-md-6">
                    <label class="form-label text-muted small fw-bold">Buscar por ID Cliente</label>
                    <div class="form-floating position-relative">
                      <input
                        v-model="filtros.customerId"
                        @input="busquedaDinamica"
                        type="text"
                        class="form-control modern-input ps-5"
                        id="buscador"
                        placeholder="ID..."
                        autocomplete="off"
                      />
                      <label for="buscador" class="ps-5">Ej: ALFKI...</label>
                      
                      <span class="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                        <i v-if="buscando" class="fas fa-spinner fa-spin text-primary"></i>
                        <i v-else class="fas fa-id-card"></i>
                      </span>
                    </div>
                  </div>
                  
                  <div class="col-md-3">
                    <label class="form-label text-muted small fw-bold">Desde</label>
                    <input 
                      type="date" 
                      v-model="filtros.fromDate" 
                      @change="buscarFacturas"
                      class="form-control modern-input" 
                    />
                  </div>
                  
                  <div class="col-md-3">
                    <label class="form-label text-muted small fw-bold">Hasta</label>
                    <input 
                      type="date" 
                      v-model="filtros.toDate" 
                      @change="buscarFacturas"
                      class="form-control modern-input" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="card modern-card">
              <div class="card-header bg-gradient-info d-flex justify-content-between align-items-center">
                <h5 class="card-title text-white mb-0">
                  <i class="fas fa-list-alt me-2"></i>Órdenes de Venta
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
                <div class="table-responsive mb-4">
                  <table class="table modern-table">
                    <thead class="table-dark">
                      <tr>
                        <th>N° Orden</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Ciudad</th>
                        <th>Total</th>
                        <th class="text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="6" class="text-center py-5">
                           <div class="spinner-border text-primary" role="status"></div>
                           <p class="mt-2 text-muted">Cargando facturas...</p>
                        </td>
                      </tr>
                      
                      <tr v-else-if="facturas.length === 0">
                        <td colspan="6" class="text-center py-4 text-muted">
                          No se encontraron facturas.
                        </td>
                      </tr>

                      <tr v-else 
                          v-for="factura in facturas" 
                          :key="factura.orderId" 
                          class="table-row"
                      >
                        <td class="fw-bold text-primary">#{{ factura.orderId }}</td>
                        <td>
                            <div class="d-flex flex-column">
                                <span class="fw-bold text-dark">{{ factura.customerName }}</span>
                                <span class="text-muted small badge bg-light text-dark border w-auto align-self-start mt-1">
                                    {{ factura.customerId }}
                                </span>
                            </div>
                        </td>
                        <td>{{ formatearFecha(factura.orderDate) }}</td>
                        <td>
                            <i class="fas fa-map-marker-alt text-danger me-1 small"></i>
                            {{ factura.shipCity }}
                        </td>
                        <td class="fw-bold text-success fs-6">
                            ${{ factura.totalAmount.toFixed(2) }}
                        </td>
                        <td class="text-center">
                          <button 
                            class="btn-action btn-view" 
                            @click="verDetalle(factura.orderId)" 
                            title="Ver detalle"
                          >
                            <i class="fas fa-eye me-1"></i> Ver
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="pagination-container" v-if="!loading && totalPaginas > 0">
                  <button class="btn-nav" :disabled="paginacion.pageNumber === 1" @click="cambiarPagina(-1)">
                    <i class="fas fa-chevron-left me-2"></i> Anterior
                  </button>
                  <div class="page-info">
                    <span class="fw-bold text-dark">Página {{ paginacion.pageNumber }}</span>
                    <span class="text-muted small ms-1">de {{ totalPaginas }}</span>
                  </div>
                  <button class="btn-nav" :disabled="paginacion.pageNumber >= totalPaginas" @click="cambiarPagina(1)">
                    Siguiente <i class="fas fa-chevron-right ms-2"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div> 
  </div>

  <Teleport to="body">
    <div class="modal fade" ref="detalleModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content modern-modal">
          <div class="modal-header bg-gradient-primary text-white">
            <div>
                <h5 class="modal-title mb-0"><i class="fas fa-receipt me-2"></i>Orden #{{ detalle?.orderId }}</h5>
                <small v-if="detalle" class="opacity-75">{{ detalle.customerName }} | {{ formatearFecha(detalle.orderDate) }}</small>
            </div>
            <button type="button" class="btn-close btn-close-white" @click="cerrarModal"></button>
          </div>
          <div class="modal-body p-4">
            <div v-if="loadingDetalle" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2">Cargando productos...</p>
            </div>
            <div v-else-if="detalle">
                <div class="alert alert-light border d-flex justify-content-between align-items-center mb-4 shadow-sm">
                    <div>
                        <h6 class="fw-bold mb-1 text-primary"><i class="fas fa-shipping-fast me-2"></i>Envío</h6>
                        <span class="text-muted d-block small">{{ detalle.shipAddress }}, {{ detalle.shipCity }}</span>
                    </div>
                    <div class="text-end">
                        <span class="badge bg-secondary p-2">Items: {{ detalle.itemCount }}</span>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table table-sm table-striped table-hover align-middle">
                        <thead class="table-light">
                            <tr><th>Producto</th><th class="text-center">Cant.</th><th class="text-end">Precio</th><th class="text-end">Subtotal</th></tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in detalle.orderDetails" :key="item.productId">
                                <td>{{ item.productName }}</td>
                                <td class="text-center fw-bold">{{ item.quantity }}</td>
                                <td class="text-end">${{ item.unitPrice.toFixed(2) }}</td>
                                <td class="text-end fw-bold text-dark">${{ item.subtotal.toFixed(2) }}</td>
                            </tr>
                        </tbody>
                        <tfoot class="table-group-divider bg-white">
                            <tr><td colspan="3" class="text-end fw-bold fs-5 pt-3">TOTAL:</td><td class="text-end fw-bold fs-4 text-success pt-3">${{ detalle.totalAmount.toFixed(2) }}</td></tr>
                        </tfoot>
                    </table>
                </div>
            </div>
          </div>
          <div class="modal-footer bg-light">
            <button type="button" class="btn btn-secondary modern-btn" @click="cerrarModal">Cerrar</button>
            <button type="button" class="btn btn-primary modern-btn" onclick="window.print()"><i class="fas fa-print me-2"></i>Imprimir</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { Modal } from 'bootstrap';

export default {
  name: "ListadoFacturas",
  data() {
    return {
      facturas: [],
      filtros: {
          customerId: "",
          fromDate: "",
          toDate: ""
      },
      paginacion: {
        pageNumber: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false
      },
      
      loading: false,
      buscando: false,
      loadingDetalle: false,
      debounceTimeout: null,
      
      detalle: null,
      detalleModalInstance: null
    };
  },
  computed: {
    totalPaginas() { return this.paginacion.totalPages || 1; }
  },
  mounted() {
    this.cargarFacturas();
    this.inicializarModales();
  },
  methods: {
    inicializarModales() {
      if (this.$refs.detalleModal) this.detalleModalInstance = new Modal(this.$refs.detalleModal);
    },
    formatearFecha(fecha) {
        if (!fecha) return '-';
        return new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
    },

    // --- BÚSQUEDA DINÁMICA ---
    busquedaDinamica() {
      this.buscando = true;
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.paginacion.pageNumber = 1;
        this.cargarFacturas(); // Se ejecuta automáticamente después de escribir
      }, 600);
    },

    buscarFacturas() {
        this.paginacion.pageNumber = 1;
        this.cargarFacturas();
    },

    // --- API ---
    async cargarFacturas() {
      this.loading = true;
      try {
        const token = localStorage.getItem("token");
        const params = new URLSearchParams({
            PageNumber: this.paginacion.pageNumber,
            PageSize: this.paginacion.pageSize,
            OrderDescending: true 
        });

        if (this.filtros.customerId) params.append("CustomerId", this.filtros.customerId);
        if (this.filtros.fromDate) params.append("FromDate", this.filtros.fromDate);
        if (this.filtros.toDate) params.append("ToDate", this.filtros.toDate);

        const url = `https://localhost:7176/api/orders?${params.toString()}`;
        const res = await fetch(url, { headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}` } });

        if (!res.ok) throw new Error("Error al obtener facturas");
        const data = await res.json();
        
        this.facturas = data.items;
        this.paginacion.totalCount = data.totalCount;
        this.paginacion.totalPages = data.totalPages;
        this.paginacion.hasPreviousPage = data.hasPreviousPage;
        this.paginacion.hasNextPage = data.hasNextPage;

      } catch (err) {
        console.error("Error:", err);
      } finally {
        this.loading = false;
        this.buscando = false;
      }
    },

    cambiarPagina(delta) {
        const nuevaPagina = this.paginacion.pageNumber + delta;
        if (nuevaPagina > 0 && nuevaPagina <= this.paginacion.totalPages) {
            this.paginacion.pageNumber = nuevaPagina;
            this.cargarFacturas();
        }
    },
    cambiarTamanoPagina() {
        this.paginacion.pageNumber = 1;
        this.cargarFacturas();
    },

    // --- DETALLE ---
    async verDetalle(id) {
        this.loadingDetalle = true;
        this.detalle = null; 
        this.detalleModalInstance?.show();
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`https://localhost:7176/GetOrderById/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Error detalle");
            this.detalle = await res.json();
        } catch (err) { console.error(err); } 
        finally { this.loadingDetalle = false; }
    },
    cerrarModal() { this.detalleModalInstance?.hide(); }
  },
};
</script>

<style scoped>
/* Estilos modernos (mismos que antes) */
.full-screen-page { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-image: url("https://img.freepik.com/vector-gratis/fondo-minimalista-gradiente_23-2149976755.jpg"); background-size: cover; background-position: center; z-index: 1000; }
.overlay { width: 100%; height: 100%; overflow-y: auto; background: rgba(245, 247, 250, 0.85); padding-bottom: 50px; }
.container-fluid { background: transparent; min-height: auto; }
.gradient-title { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.bg-gradient-info { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.bg-gradient-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.bg-primary-soft { background-color: rgba(102, 126, 234, 0.1); }
.modern-card { border: none; border-radius: 20px; background: #ffffff; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); overflow: hidden; }
.modern-card .card-header { border: none; padding: 1.5rem; }
.modern-card .card-body { padding: 2rem; }
.modern-input { border-radius: 15px; border: 2px solid #e9ecef; padding: 0.75rem 1rem; background-color: #fff; }
.modern-input:focus { border-color: #667eea; box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25); }
.modern-btn { border-radius: 50px; padding: 0.5rem 1.5rem; }
.modern-table { border-radius: 15px; overflow: hidden; border: none; background-color: white; }
.modern-table .table-dark { background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); }
.table-row { transition: all 0.2s ease; }
.table-row:hover { background-color: rgba(102, 126, 234, 0.1); }
.btn-view { background-color: #3b82f6; color: white; border: none; border-radius: 6px; padding: 6px 12px; font-weight: 600; }
.btn-view:hover { background-color: #2563eb; transform: translateY(-1px); }
.pagination-container { display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; padding: 1rem; background-color: #f8f9fa; border-radius: 15px; }
.btn-nav { border: none; background: white; color: #555; font-weight: 600; padding: 0.6rem 1.2rem; border-radius: 50px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; align-items: center; }
.btn-nav:hover:not(:disabled) { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
.page-info { background: white; padding: 0.5rem 1.5rem; border-radius: 50px; border: 1px solid #e9ecef; }
.modern-modal { border-radius: 20px; border: none; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); background: white; }
.overlay::-webkit-scrollbar { width: 8px; }
.overlay::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); }
.overlay::-webkit-scrollbar-thumb { background: rgba(102, 126, 234, 0.5); border-radius: 10px; }
</style>