<template>
  <div class="container py-4">
    <h2 class="mb-4">Listado de Facturas</h2>

    <input
      v-model="filtroBusqueda"
      type="text"
      class="form-control mb-3"
      placeholder="Buscar por ID, cliente, total o fecha..."
    />

    <table class="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Total</th>
          <th>Fecha</th>
          <th>Detalle</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="factura in facturasFiltradas" :key="factura.salesOrderId">
          <td>{{ factura.salesOrderId }}</td>
          <td>{{ factura.customerName }}</td>
          <td>${{ factura.totalAmount.toFixed(2) }}</td>
          <td>{{ new Date(factura.orderDate).toLocaleDateString() }}</td>
          <td>
            <button
              class="btn btn-sm btn-primary"
              @click="abrirModal(factura.salesOrderId)"
            >
              Ver
            </button>
          </td>
        </tr>
        <tr v-if="facturasFiltradas.length === 0">
          <td colspan="5" class="text-center">No hay facturas que coincidan</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Detalle -->
    <div
      class="modal fade"
      tabindex="-1"
      role="dialog"
      :class="{ show: modalVisible }"
      :style="{ display: modalVisible ? 'block' : 'none' }"
      @click.self="cerrarModal"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalle de Productos de la Factura #{{ detalle?.salesOrderId }}</h5>
            <button type="button" class="btn-close" @click="cerrarModal"></button>
          </div>
          <div class="modal-body">
            <ul class="list-group">
              <li v-for="item in detalle?.orderDetails" :key="item.productId" class="list-group-item">
                {{ item.productName }} — Cantidad: {{ item.quantity }} — Precio unitario: ${{ item.unitPrice.toFixed(2) }}
              </li>
              <li v-if="!detalle || detalle.orderDetails.length === 0" class="list-group-item text-center">
                No hay detalles para esta factura.
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cerrarModal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListadoFacturas",
  data() {
    return {
      facturas: [],
      filtroBusqueda: "",
      detalle: null,
      modalVisible: false,
    };
  },
  computed: {
    facturasFiltradas() {
      const filtro = this.filtroBusqueda.toLowerCase().trim();
      if (!filtro) return this.facturas;

      return this.facturas.filter((factura) => {
        return (
          factura.salesOrderId.toLowerCase().includes(filtro) ||
          (factura.customerName &&
            factura.customerName.toLowerCase().includes(filtro)) ||
          factura.totalAmount.toString().includes(filtro) ||
          new Date(factura.orderDate)
            .toLocaleDateString()
            .toLowerCase()
            .includes(filtro)
        );
      });
    },
  },
  mounted() {
    this.cargarFacturas();
  },
  methods: {
    async cargarFacturas() {
      try {
        const res = await fetch("http://localhost:5265/api/SalesOrder", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener facturas");
        this.facturas = await res.json();
      } catch (err) {
        console.error("Error al cargar facturas", err);
      }
    },
    async abrirModal(salesOrderId) {
      try {
        const res = await fetch(`http://localhost:5265/api/SalesOrder/${salesOrderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Error al obtener detalles");
        this.detalle = await res.json();
        this.modalVisible = true;
        document.body.classList.add("modal-open");
      } catch (err) {
        console.error("Error al cargar detalles de la factura", err);
      }
    },
    cerrarModal() {
      this.modalVisible = false;
      this.detalle = null;
      document.body.classList.remove("modal-open");
    },
  },
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-open {
  overflow: hidden;
}
</style>

