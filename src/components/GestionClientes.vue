<template>
  <div class="gestion-clientes-container">
    <h2 class="titulo">Gestión de Clientes</h2>

    <!-- BUSCADOR DE CLIENTES -->
    <div class="buscador-clientes">
      <input
        v-model="filtroBusqueda"
        type="text"
        placeholder="Buscar por nombre, cédula o correo..."
        class="input-buscador"
      />
    </div>

    <!-- FORMULARIO DE CREACION -->
    <form
      v-if="!editando"
      @submit.prevent="crearOActualizarCliente"
      class="formulario"
    >
      <div class="form-grid">
        <div class="form-col">
          <input
            v-model="nuevoCliente.cedula"
            type="text"
            placeholder="Cédula"
            maxlength="10"
            required
            pattern="^[0-9]{10}$"
          />
          <input
            v-model="nuevoCliente.firstName"
            type="text"
            placeholder="Nombre"
            required
          />
          <input
            v-model="nuevoCliente.lastName"
            type="text"
            placeholder="Apellido"
            required
          />
        </div>
        <div class="form-col">
          <input
            v-model="nuevoCliente.email"
            type="email"
            placeholder="Correo"
            required
          />
          <input
            v-model="nuevoCliente.address"
            type="text"
            placeholder="Dirección"
          />
          <input
            v-model="nuevoCliente.phone"
            type="text"
            placeholder="Teléfono"
            maxlength="10"
            required
            pattern="^[0-9]{10}$"
          />
        </div>
      </div>
      <div class="form-button">
        <button type="submit" class="btn btn-primary">Crear Cliente</button>
      </div>
    </form>

    <!-- TABLA DE CLIENTES -->
    <div class="tabla-clientes">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(cliente, index) in clientesFiltrados"
            :key="cliente.customerId"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ cliente.cedula }}</td>
            <td>{{ cliente.firstName }}</td>
            <td>{{ cliente.lastName }}</td>
            <td>{{ cliente.email }}</td>
            <td>{{ cliente.address }}</td>
            <td>{{ cliente.phone }}</td>
            <td>
              <button
                class="btn btn-warning btn-sm me-2"
                @click="editarCliente(cliente)"
              >
                Editar
              </button>
              <button
                class="btn btn-danger btn-sm"
                @click="eliminarCliente(cliente.customerId)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL EDITAR CLIENTE -->
    <div v-if="editando" class="modal-overlay" @click="cancelarEdicion">
      <div class="modal-contenido-editar" @click.stop>
        <h3 class="modal-titulo">Editar Cliente</h3>
        <input v-model="nuevoCliente.cedula" type="text" placeholder="Cédula" />
        <input
          v-model="nuevoCliente.firstName"
          type="text"
          placeholder="Nombre"
        />
        <input
          v-model="nuevoCliente.lastName"
          type="text"
          placeholder="Apellido"
        />
        <input v-model="nuevoCliente.email" type="email" placeholder="Correo" />
        <input
          v-model="nuevoCliente.address"
          type="text"
          placeholder="Dirección"
        />
        <input
          v-model="nuevoCliente.phone"
          type="text"
          placeholder="Teléfono"
        />
        <div class="modal-botones">
          <button class="btn btn-success" @click="confirmarActualizarCliente">
            Guardar
          </button>
          <button class="btn btn-secondary" @click="cancelarEdicion">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- MODALES DE NOTIFICACIÓN -->
    <div
      v-if="modal.mostrar && modal.tipo === 'exito'"
      class="modal-overlay"
      @click="cerrarModal"
    >
      <div class="modal-contenido modal-exito" @click.stop>
        <h3>¡Éxito!</h3>
        <p>{{ modal.mensaje }}</p>
        <button class="btn btn-success" @click="cerrarModal">Aceptar</button>
      </div>
    </div>

    <div
      v-if="modal.mostrar && modal.tipo === 'error'"
      class="modal-overlay"
      @click="cerrarModal"
    >
      <div class="modal-contenido modal-error" @click.stop>
        <h3>Error</h3>
        <p>{{ modal.mensaje }}</p>
        <button class="btn btn-danger" @click="cerrarModal">Cerrar</button>
      </div>
    </div>

    <div
      v-if="modal.mostrar && modal.tipo === 'confirmacion'"
      class="modal-overlay"
      @click="cerrarModal"
    >
      <div class="modal-contenido modal-confirmacion" @click.stop>
        <h3>Confirmar Acción</h3>
        <p>{{ modal.mensaje }}</p>
        <div class="modal-botones">
          <button class="btn btn-secondary" @click="cerrarModal">
            Cancelar
          </button>
          <button class="btn btn-danger" @click="confirmarAccion">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GestionClientes",
  data() {
    return {
      clientes: [],
      filtroBusqueda: "",
      nuevoCliente: {
        cedula: "",
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        phone: "",
      },
      editando: false,
      clienteEditandoId: null,
      modal: {
        mostrar: false,
        tipo: "",
        mensaje: "",
        accion: null,
      },
    };
  },
  computed: {
    clientesFiltrados() {
      const filtro = this.filtroBusqueda.trim().toLowerCase();
      if (!filtro) return this.clientes;
      return this.clientes.filter((cliente) => {
        return (
          cliente.cedula.toLowerCase().includes(filtro) ||
          cliente.firstName.toLowerCase().includes(filtro) ||
          cliente.lastName.toLowerCase().includes(filtro) ||
          cliente.email.toLowerCase().includes(filtro)
        );
      });
    },
  },
  methods: {
    mostrarModal(tipo, mensaje, accion = null) {
      this.modal = { mostrar: true, tipo, mensaje, accion };
    },
    cerrarModal() {
      this.modal.mostrar = false;
      this.modal.accion = null;
    },
    confirmarAccion() {
      if (this.modal.accion) this.modal.accion();
      this.cerrarModal();
    },
    async cargarClientes() {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5265/api/Customer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.clientes = await res.json();
    },
    async crearOActualizarCliente() {
      await this.enviarCliente("POST");
    },
    async enviarCliente(metodo) {
  const token = localStorage.getItem("token");
  const url =
    metodo === "PUT"
      ? `http://localhost:5265/api/Customer/${this.clienteEditandoId}`
      : "http://localhost:5265/api/Customer";

  const res = await fetch(url, {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(this.nuevoCliente),
  });

  const data = await res.json(); // Siempre leemos el JSON

  if (res.ok && data.success) {
    this.mostrarModal("exito", data.message || "Operación exitosa.");
    this.nuevoCliente = {
      cedula: "",
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      phone: "",
    };
    this.editando = false;
    this.clienteEditandoId = null;
    this.cargarClientes();
  } else {
    this.mostrarModal("error", data.message || "Error al procesar la solicitud.");
  }
}
,
    editarCliente(cliente) {
      this.nuevoCliente = { ...cliente };
      this.clienteEditandoId = cliente.customerId;
      this.editando = true;
    },
    confirmarActualizarCliente() {
      this.mostrarModal(
        "confirmacion",
        "¿Deseas guardar los cambios del cliente?",
        async () => {
          await this.enviarCliente("PUT");
        }
      );
    },
    cancelarEdicion() {
      this.editando = false;
      this.nuevoCliente = {
        cedula: "",
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        phone: "",
      };
      this.clienteEditandoId = null;
    },
    async eliminarCliente(id) {
      this.mostrarModal("confirmacion", "¿Eliminar cliente?", async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5265/api/Customer/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          this.mostrarModal("exito", "Cliente eliminado correctamente.");
          this.cargarClientes();
        } else {
          this.mostrarModal("error", "No se pudo eliminar el cliente.");
        }
      });
    },
  },
  mounted() {
    this.cargarClientes();
  },
};
</script>

<style scoped>
.gestion-clientes-container {
  background: #f0f8ff;
  padding: 2rem;
  max-width: 1100px;
  margin: auto;
  border-radius: 10px;
}
.titulo {
  text-align: center;
  font-size: 2rem;
  color: #0d47a1;
  font-weight: bold;
}
.buscador-clientes {
  margin-bottom: 1rem;
  text-align: right;
}
.input-buscador {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 300px;
}
.formulario {
  background: #e3f2fd;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 2rem;
}
.form-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.form-col {
  flex: 1 1 45%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
input {
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.btn {
  padding: 0.5rem 1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn-primary {
  background-color: #1976d2;
  color: white;
}
.btn-warning {
  background-color: #fbc02d;
}
.btn-danger {
  background-color: #e53935;
  color: white;
}
.btn-success {
  background-color: #4caf50;
  color: white;
}
.btn-secondary {
  background-color: #757575;
  color: white;
}
.btn-sm {
  padding: 0.3rem 0.6rem;
}
.tabla-clientes {
  background: #fff;
  padding: 1rem;
  border-radius: 10px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ccc;
  padding: 0.8rem;
  text-align: center;
}
th {
  background: #bbdefb;
}
tr:nth-child(even) {
  background: #f9f9f9;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-contenido,
.modal-contenido-editar {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}
.modal-contenido-editar {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.modal-titulo {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.modal-botones {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}
</style>