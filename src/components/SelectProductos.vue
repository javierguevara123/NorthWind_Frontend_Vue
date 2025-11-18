<template>
  <div class="productos-container">
    <h2 class="titulo">Gestión de Productos</h2>

    <!-- Campo de búsqueda -->
    <input
      v-model="filtroBusqueda"
      type="text"
      placeholder="Buscar por código, nombre, categoría, precio o stock..."
      class="busqueda-input mb-3"
    />

    <!-- Formulario de creación -->
    <form @submit.prevent="crearProducto" class="formulario">
      <!-- ... el formulario igual ... -->
    </form>

    <!-- Tabla -->
    <table class="tabla">
  <thead>
    <tr>
      <th>#</th>
      <th>Código</th>
      <th>Nombre</th>
      <th>Categoría</th>
      <th>Precio</th>
      <th>Stock</th>
      <!-- Columna de Acciones eliminada -->
    </tr>
  </thead>
  <tbody>
    <tr
      v-for="(producto, index) in productosFiltrados"
      :key="producto.productId"
    >
      <td>{{ index + 1 }}</td>
      <td>{{ producto.code }}</td>
      <td>{{ producto.name }}</td>
      <td>{{ producto.category }}</td>
      <td>{{ producto.unitPrice }}</td>
      <td>{{ producto.stock }}</td>
      <!-- Botones de Editar y Eliminar eliminados -->
    </tr>
  </tbody>
</table>


    <!-- Modal personalizado -->
    <div v-if="mostrarModal" class="modal-overlay">
      <!-- ... el modal igual ... -->
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectProductos",
  data() {
    return {
      productos: [],
      filtroBusqueda: "",  // <-- agregado filtro de búsqueda
      nuevoProducto: {
        code: "",
        name: "",
        category: "",
        unitPrice: 0,
        stock: 0,
      },
      productoEditado: {},
      mostrarModal: false,
      errores: {},
      erroresEdicion: {},
    };
  },
  computed: {
    productosFiltrados() {
      const filtro = this.filtroBusqueda.toLowerCase().trim();
      if (!filtro) return this.productos;
      return this.productos.filter((p) => {
        return (
          (p.code && p.code.toLowerCase().includes(filtro)) ||
          (p.name && p.name.toLowerCase().includes(filtro)) ||
          (p.category && p.category.toLowerCase().includes(filtro)) ||
          (p.unitPrice !== undefined &&
            p.unitPrice.toString().includes(filtro)) ||
          (p.stock !== undefined && p.stock.toString().includes(filtro))
        );
      });
    },
  },
  mounted() {
    this.cargarProductos();
  },
  methods: {
    async cargarProductos() {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5265/api/Product", {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.productos = await res.json();
    },
    // resto de métodos como crearProducto, editar, etc...
  },
};
</script>

<style scoped>
.busqueda-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
}
</style>


<style scoped>
.productos-container {
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
  font-family: "Segoe UI", sans-serif;
}

.titulo {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #0d47a1;
}

.formulario {
  background: #f1f5fb;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.campos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.campo {
  display: flex;
  flex-direction: column;
}

input {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.error {
  color: red;
  font-size: 0.85rem;
  margin-top: 4px;
}

.btn-crear {
  background-color: #1976d2;
  color: white;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.tabla th,
.tabla td {
  padding: 0.75rem;
  border: 1px solid #ccc;
  text-align: center;
}

.tabla th {
  background-color: #e3f2fd;
}

.btn-editar,
.btn-eliminar {
  padding: 0.4rem 0.8rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-editar {
  background-color: #ffb300;
  color: white;
}

.btn-eliminar {
  background-color: #e53935;
  color: white;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-box {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
}

.modal-box input {
  width: 100%;
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-guardar {
  background-color: #388e3c;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-cancelar {
  background-color: #9e9e9e;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
