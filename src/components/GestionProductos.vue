<template>
  <div class="productos-container">
    <h2 class="titulo">Gestión de Productos</h2>

    <!-- Cuadro de búsqueda -->
    <div class="buscador">
      <input
        v-model="busqueda"
        placeholder="Buscar producto..."
        class="input-busqueda"
      />
    </div>

    <!-- Formulario de creación -->
    <form @submit.prevent="crearProducto" class="formulario">
      <h5>Nuevo Producto</h5>
      <div class="campos">
        <div class="campo">
          <input v-model="nuevoProducto.code" placeholder="Código" />
          <p class="error" v-if="errores.code">{{ errores.code }}</p>
        </div>
        <div class="campo">
          <input v-model="nuevoProducto.name" placeholder="Nombre" />
          <p class="error" v-if="errores.name">{{ errores.name }}</p>
        </div>
        <div class="campo">
          <input v-model="nuevoProducto.category" placeholder="Categoría" />
        </div>
        <div class="campo">
          <input
            v-model.number="nuevoProducto.unitPrice"
            type="number"
            placeholder="Precio Unitario"
          />
          <p class="error" v-if="errores.unitPrice">{{ errores.unitPrice }}</p>
        </div>
        <div class="campo">
          <input
            v-model.number="nuevoProducto.stock"
            type="number"
            placeholder="Stock"
          />
          <p class="error" v-if="errores.stock">{{ errores.stock }}</p>
        </div>
        <button class="btn-crear">Crear Producto</button>
      </div>
    </form>

    <!-- Tabla de productos -->
    <table class="tabla">
      <thead>
        <tr>
          <th>#</th>
          <th>Código</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Acciones</th>
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
          <td>
            <button class="btn-editar" @click="editar(producto)">Editar</button>
            <button
              class="btn-eliminar"
              @click="confirmarEliminar(producto.productId)"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal edición -->
    <div v-if="mostrarModal" class="modal-overlay">
      <div class="modal-box">
        <h3>Editar Producto</h3>
        <form @submit.prevent="guardarEdicion">
          <div class="campo">
            <input v-model="productoEditado.code" placeholder="Código" />
            <p class="error" v-if="erroresEdicion.code">
              {{ erroresEdicion.code }}
            </p>
          </div>
          <div class="campo">
            <input v-model="productoEditado.name" placeholder="Nombre" />
            <p class="error" v-if="erroresEdicion.name">
              {{ erroresEdicion.name }}
            </p>
          </div>
          <div class="campo">
            <input v-model="productoEditado.category" placeholder="Categoría" />
          </div>
          <div class="campo">
            <input
              v-model.number="productoEditado.unitPrice"
              type="number"
              placeholder="Precio"
            />
            <p class="error" v-if="erroresEdicion.unitPrice">
              {{ erroresEdicion.unitPrice }}
            </p>
          </div>
          <div class="campo">
            <input
              v-model.number="productoEditado.stock"
              type="number"
              placeholder="Stock"
            />
            <p class="error" v-if="erroresEdicion.stock">
              {{ erroresEdicion.stock }}
            </p>
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn-guardar">Guardar</button>
            <button type="button" class="btn-cancelar" @click="cerrarModal">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de mensaje -->
    <div
      v-if="mensaje.visible"
      class="modal-overlay"
      @click="mensaje.visible = false"
    >
      <div class="modal-box" @click.stop>
        <h3
          :style="{ color: mensaje.tipo === 'error' ? '#e53935' : '#388e3c' }"
        >
          {{ mensaje.tipo === "error" ? "Error" : "Éxito" }}
        </h3>
        <p>{{ mensaje.texto }}</p>
        <div class="modal-actions">
          <button class="btn-guardar" @click="mensaje.visible = false">
            Aceptar
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmación de eliminación -->
    <div v-if="confirmacion.visible" class="modal-overlay">
      <div class="modal-box">
        <h3 style="color: #ff9800">Confirmar Eliminación</h3>
        <p>¿Deseas eliminar este producto?</p>
        <div class="modal-actions">
          <button class="btn-cancelar" @click="confirmacion.visible = false">
            Cancelar
          </button>
          <button class="btn-eliminar" @click="eliminar(confirmacion.id)">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GestionProductos",
  data() {
    return {
      busqueda: "",
      productos: [],
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
      mensaje: {
        visible: false,
        texto: "",
        tipo: "exito",
      },
      confirmacion: {
        visible: false,
        id: null,
      },
    };
  },
  computed: {
    productosFiltrados() {
      const filtro = this.busqueda.toLowerCase();
      return this.productos.filter(
        (p) =>
          p.code.toLowerCase().includes(filtro) ||
          p.name.toLowerCase().includes(filtro) ||
          p.category.toLowerCase().includes(filtro)
      );
    },
  },
  mounted() {
    this.cargarProductos();
  },
  methods: {
    mostrarMensaje(tipo, texto) {
      this.mensaje = { visible: true, texto, tipo };
    },
    validarCampos(producto, errores) {
      errores.code = producto.code.trim() ? "" : "El código es obligatorio.";
      errores.name = producto.name.trim() ? "" : "El nombre es obligatorio.";
      errores.unitPrice =
        producto.unitPrice > 0 ? "" : "El precio debe ser mayor a 0.";
      errores.stock =
        producto.stock >= 0 ? "" : "El stock no puede ser negativo.";
      return !Object.values(errores).some((msg) => msg);
    },
    async cargarProductos() {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5265/api/Product", {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.productos = await res.json();
    },
    async crearProducto() {
      this.errores = {};
      if (!this.validarCampos(this.nuevoProducto, this.errores)) return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5265/api/Product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(this.nuevoProducto),
        });
        if (res.ok) {
          this.mostrarMensaje("exito", "Producto creado correctamente.");
          this.nuevoProducto = {
            code: "",
            name: "",
            category: "",
            unitPrice: 0,
            stock: 0,
          };
          this.cargarProductos();
        } else {
          const data = await res.json();
          this.mostrarMensaje(
            "error",
            data.message || "Error al crear producto."
          );
        }
      } catch {
        this.mostrarMensaje("error", "Error al conectar con el servidor.");
      }
    },
    editar(producto) {
      this.productoEditado = { ...producto };
      this.mostrarModal = true;
    },
    cerrarModal() {
      this.mostrarModal = false;
      this.erroresEdicion = {};
    },
    async guardarEdicion() {
      this.erroresEdicion = {};
      if (!this.validarCampos(this.productoEditado, this.erroresEdicion))
        return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5265/api/Product/${this.productoEditado.productId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(this.productoEditado),
          }
        );
        if (res.ok) {
          this.mostrarMensaje("exito", "Producto actualizado correctamente.");
          this.cargarProductos();
          this.cerrarModal();
        } else {
          const data = await res.json();
          this.mostrarMensaje(
            "error",
            data.message || "Error al actualizar producto."
          );
        }
      } catch {
        this.mostrarMensaje("error", "Error al conectar con el servidor.");
      }
    },
    confirmarEliminar(id) {
      this.confirmacion = { visible: true, id };
    },
    async eliminar(id) {
      this.confirmacion.visible = false;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5265/api/Product/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          this.mostrarMensaje("exito", "Producto eliminado correctamente.");
          this.cargarProductos();
        } else {
          this.mostrarMensaje("error", "No se pudo eliminar el producto.");
        }
      } catch {
        this.mostrarMensaje("error", "Error al conectar con el servidor.");
      }
    },
  },
};
</script>

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
  margin-bottom: 1rem;
  color: #0d47a1;
}
.buscador {
  margin-bottom: 1rem;
  text-align: right;
}
.input-busqueda {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 250px;
}
.formulario {
  background: #f1f5fb;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}
.campos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}
input {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.btn-crear {
  background-color: #1976d2;
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}
.tabla {
  width: 100%;
  border-collapse: collapse;
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
.btn-editar {
  background-color: #ffb300;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
}
.btn-eliminar {
  background-color: #e53935;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
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
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
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
  border-radius: 8px;
}
.btn-cancelar {
  background-color: #9e9e9e;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}
.error {
  color: red;
  font-size: 0.85rem;
  margin-top: 4px;
}
</style>