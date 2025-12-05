<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-primary">Reporte de Errores</h2>

    <table class="table table-bordered table-hover table-sm">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Mensaje</th>
          <th>Controlador</th>
          <th>Método</th>
          <th>Usuario</th>
          <th>Fecha</th>
          <th>Detalle</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="error in errores" :key="error.errorLogId">
          <td>{{ error.errorLogId }}</td>
          <td>{{ error.message }}</td>
          <td>{{ error.controller }}</td>
          <td>{{ error.method }}</td>
          <td>{{ error.userEmail }}</td>
          <td>{{ new Date(error.loggedAt).toLocaleString() }}</td>
          <td>
            <button class="btn btn-sm btn-info" @click="verDetalle(error)">Ver</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Detalle -->
    <div v-if="detalle" class="modal fade show d-block bg-dark bg-opacity-50" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalle del Error #{{ detalle.errorLogId }}</h5>
            <button type="button" class="btn-close" @click="detalle = null"></button>
          </div>
          <div class="modal-body">
            <pre>{{ detalle.detail }}</pre>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="detalle = null">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReporteErrores",
  data() {
    return {
      errores: [],
      detalle: null,
    };
  },
  methods: {
    async cargarErrores() {
      console.log("➡ Ejecutando cargarErrores...");

      try {
        const response = await fetch("http://northwindweb.somee.com/api/errorlogs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        console.log("➡ Respuesta recibida:", response);

        if (!response.ok) {
          throw new Error("Error al cargar registros");
        }

        const data = await response.json();
        console.log("➡ Datos parseados:", data);

        this.errores = data;
      } catch (error) {
        alert("No se pudo cargar los errores.");
        console.error("❌ Error en cargarErrores:", error);
      }
    }
  },
  mounted() {
    this.cargarErrores(); // Llama al método al montar el componente
  }
};
</script>


<style scoped>
.modal {
  display: block;
}
pre {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  max-height: 400px;
  overflow: auto;
}
</style>
