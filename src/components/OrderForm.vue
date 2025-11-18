<template>
  <div class="center-zoom-wrapper">
    <div class="facturador-container">
      <!-- Encabezado con número de factura -->
      <div class="factura-header">
        <label>Factura número:</label>
        <span class="numero-factura">{{ numeroFactura }}</span>
      </div>

      <!-- Sección de datos del cliente -->
      <div class="section cliente-section">
        <h2>Datos del Cliente</h2>

        <div class="search-container">
  <button @click="abrirModalClientes" class="btn-buscar" :disabled="loading">
    Buscar Cliente
  </button>
</div>

        <!-- Datos del cliente seleccionado -->
        <table class="detalle-table" v-if="cliente.id">
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Cédula</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Dirección</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ cliente.nombres }}</td>
              <td>{{ cliente.apellidos }}</td>
              <td>{{ cliente.cedula }}</td>
              <td>{{ cliente.telefono }}</td>
              <td>{{ cliente.correo }}</td>
              <td>{{ cliente.direccion }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Sección de ingreso de productos -->
      <div class="section productos-section">
  <h2>Ingreso de Producto</h2>
  <div class="search-container">
    <button @click="abrirModalProductos" class="btn-buscar" :disabled="loading">
      {{ loading ? 'Cargando...' : 'Buscar Producto' }}
    </button>
  </div>


        <div class="form-grid">
          <div class="form-group">
            <label>Descripción:</label>
            <input v-model="producto.descripcion" readonly />
          </div>
          <div class="form-group">
            <label>Precio Unitario:</label>
            <input type="number" v-model.number="producto.precioUnitario" readonly />
          </div>
          <div class="form-group">
            <label>Cantidad:</label>
            <input type="number" v-model.number="producto.cantidad" min="1" />
          </div>
          <div class="form-group">
            <label>IVA:</label>
            <select v-model="producto.iva">
              <option value="12">12%</option>
              <option value="0">0%</option>
            </select>
          </div>
          <div class="form-group">
            <button @click="agregarProducto" class="btn-agregar">Agregar Producto</button>
          </div>
        </div>
      </div>

      <!-- Sección de detalle de factura -->
      <div class="section detalle-section">
        <h2>Detalle Factura</h2>
        <div class="table-container">
          <table class="detalle-table">
            <thead>
              <tr>
                <th>Cantidad</th>
                <th>Descripción</th>
                <th>P. Unitario</th>
                <th>IVA</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in detalleFactura" :key="index">
                <td>
                  <input
                    type="number"
                    v-model.number="item.cantidad"
                    min="1"
                    style="width: 60px;"
                  />
                </td>
                <td>{{ item.descripcion }}</td>
                <td>${{ item.precioUnitario.toFixed(2) }}</td>
                <td>{{ item.iva }}%</td>
                <td>${{ (item.cantidad * item.precioUnitario * (1 + item.iva/100)).toFixed(2) }}</td>
                <td>
                  <button @click="eliminarProducto(index)" class="btn-eliminar">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="totales-container">
          <div class="total-row">
            <span>Subtotal 12%:</span>
            <span>${{ subtotal12.toFixed(2) }}</span>
          </div>
          <div class="total-row">
            <span>Subtotal 0%:</span>
            <span>${{ subtotal0.toFixed(2) }}</span>
          </div>
          <div class="total-row">
            <span>Subtotal:</span>
            <span>${{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="total-row">
            <span>IVA 12%:</span>
            <span>${{ iva12.toFixed(2) }}</span>
          </div>
          <div class="total-row total-final">
            <span>Total a pagar:</span>
            <span>${{ totalPagar.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="action-buttons">
        <button @click="guardarFactura" class="btn-guardar" :disabled="saving">
          {{ saving ? 'Guardando...' : 'Guardar e Imprimir' }}
        </button>
        <button @click="imprimirFacturaPDF" class="btn-guardar" style="background-color:#2196F3;">
          Imprimir PDF
        </button>
      </div>

      <!-- Componente de impresión (oculto) -->
      <div ref="facturaImpresion" class="factura-impresion" style="display: none;">
        <div class="factura-print">
          <div class="print-header">
            <h1>FACTURA</h1>
            <p><strong>Número: {{ numeroFactura }}</strong></p>
            <p><strong>Fecha: {{ fechaActual }}</strong></p>
          </div>
          
          <div class="print-cliente">
            <h3>DATOS DEL CLIENTE</h3>
            <p><strong>Nombre:</strong> {{ cliente.nombres }} {{ cliente.apellidos }}</p>
            <p><strong>Cédula:</strong> {{ cliente.cedula }}</p>
            <p><strong>Teléfono:</strong> {{ cliente.telefono }}</p>
            <p><strong>Correo:</strong> {{ cliente.correo }}</p>
            <p><strong>Dirección:</strong> {{ cliente.direccion }}</p>
          </div>

          <div class="print-detalle">
            <h3>DETALLE DE PRODUCTOS</h3>
            <table class="print-table">
              <thead>
                <tr>
                  <th>Cant.</th>
                  <th>Descripción</th>
                  <th>P. Unit.</th>
                  <th>IVA</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in detalleFactura" :key="item.descripcion">
                  <td>{{ item.cantidad }}</td>
                  <td>{{ item.descripcion }}</td>
                  <td>${{ item.precioUnitario.toFixed(2) }}</td>
                  <td>{{ item.iva }}%</td>
                  <td>${{ (item.cantidad * item.precioUnitario * (1 + item.iva/100)).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="print-totales">
            <div class="totales-print">
              <p><strong>Subtotal 12%:</strong> ${{ subtotal12.toFixed(2) }}</p>
              <p><strong>Subtotal 0%:</strong> ${{ subtotal0.toFixed(2) }}</p>
              <p><strong>Subtotal:</strong> ${{ subtotal.toFixed(2) }}</p>
              <p><strong>IVA 12%:</strong> ${{ iva12.toFixed(2) }}</p>
              <p class="total-print"><strong>TOTAL A PAGAR: ${{ totalPagar.toFixed(2) }}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


 <div v-if="mostrarModalClientes" class="modal-overlay">
  <div class="modal-content">
    <div class="modal-header">
      <span>Seleccionar Cliente</span>
      <button class="modal-cerrar" @click="mostrarModalClientes = false">X</button>
    </div>

    <div class="modal-body">
      <input 
        type="text" 
        v-model="clienteSearch" 
        @input="filtrarClientes" 
        placeholder="Buscar por nombre, apellido o cédula..." 
        class="form-control mb-3"
      />

      <table class="modal-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Cédula</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="cliente in clientesFiltrados" 
            :key="cliente.customerId" 
            @click="seleccionarCliente(cliente); mostrarModalClientes = false"
            style="cursor: pointer;"
          >
            <td>{{ cliente.firstName }}</td>
            <td>{{ cliente.lastName }}</td>
            <td>{{ cliente.cedula }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal-footer">
      <button class="modal-cerrar" @click="mostrarModalClientes = false">Cerrar</button>
    </div>
  </div>
</div>


<div v-if="mostrarModalProductos" class="modal-overlay">
  <div class="modal-content">
    <div class="modal-header">
      <span>Seleccionar Producto</span>
      <button class="modal-cerrar" @click="mostrarModalProductos = false">X</button>
    </div>

    <div class="modal-body">
      <input 
        type="text" 
        v-model="productoFiltro" 
        @input="filtrarProductos" 
        placeholder="Buscar por código o nombre..." 
        class="form-control mb-3"
      />

      <table class="modal-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio Unitario</th>
            <th>Stock</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="producto in productosFiltrados" :key="producto.productId">
            <td>{{ producto.code }}</td>
            <td>{{ producto.name }}</td>
            <td>{{ producto.category }}</td>
            <td>${{ producto.unitPrice.toFixed(2) }}</td>
            <td>{{ producto.stock }}</td>
            <td>
              <button
                @click="seleccionarProducto(producto); mostrarModalProductos = false"
                :disabled="producto.stock === 0"
                class="btn-agregar"
              >
                Seleccionar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal-footer">
      <button class="modal-cerrar" @click="mostrarModalProductos = false">Cerrar</button>
    </div>
  </div>
</div>



</template>

<script>
import jsPDF from "jspdf";

const ApiBaseUrl = 'http://localhost:5265/api/';

export default {
  name: 'OrderFormComponent',
  data() {
    return {
      numeroFactura: '', // Inicialmente vacío
      clienteSearch: '',
      productoSearch: '',
      loading: false,
      saving: false,
      clientesEncontrados: [],
      clientesFiltrados: [],
      productosEncontrados: [],
      
      cliente: {
        id: null,
        nombres: '',
        apellidos: '',
        cedula: '',
        telefono: '',
        correo: '',
        direccion: ''
      },
      producto: {
        id: null,
        descripcion: '',
        precioUnitario: 0,
        cantidad: 1,
        iva: '12'
      },
      detalleFactura: [],
      mostrarModalClientes: false,
    productosFiltrados: [],
    productoFiltro: '',
    mostrarModalProductos: false,
    fechaFactura: '', // <-- Agrega esta propiedad
    }
  },
  async created() {
    await this.obtenerUltimoNumeroFacturaYFecha();
  },
  computed: {
    subtotal12() {
      return this.detalleFactura
        .filter(item => item.iva === 12)
        .reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
    },
    subtotal0() {
      return this.detalleFactura
        .filter(item => item.iva === 0)
        .reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);
    },
    subtotal() {
      return this.subtotal12 + this.subtotal0;
    },
    iva12() {
      return this.subtotal12 * 0.12;
    },
    totalPagar() {
      return this.subtotal + this.iva12;
    },
    fechaActual() {
      // Cambia para usar la fecha del servidor si está disponible
      return this.fechaFactura || new Date().toLocaleDateString('es-ES');
    }
  },
  methods: {
  abrirModalClientes() {
    this.buscarClientes();
  },

  async buscarClientes() {
    this.loading = true;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${ApiBaseUrl}Customer`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.clientesEncontrados = await response.json();
      this.clientesFiltrados = this.clientesEncontrados;
      this.mostrarModalClientes = true;  // <-- Aquí abres el modal
      this.clienteSearch = '';
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      alert('Error al obtener clientes. Verifique la conexión con el servidor.');
    } finally {
      this.loading = false;
    }
  },

  filtrarClientes() {
    const termino = this.clienteSearch.toLowerCase();
    this.clientesFiltrados = this.clientesEncontrados.filter(cliente =>
      cliente.firstName.toLowerCase().includes(termino) ||
      cliente.lastName.toLowerCase().includes(termino) ||
      cliente.cedula.includes(termino)
    );
  },

  seleccionarCliente(clienteSeleccionado) {
    this.cliente = {
      id: clienteSeleccionado.customerId,
      nombres: clienteSeleccionado.firstName,
      apellidos: clienteSeleccionado.lastName,
      cedula: clienteSeleccionado.cedula,
      telefono: clienteSeleccionado.phone || '',
      correo: clienteSeleccionado.email || '',
      direccion: clienteSeleccionado.address || ''
    };
    this.clientesEncontrados = [];
    this.clientesFiltrados = [];
    this.clienteSearch = '';
    this.mostrarModalClientes = false; // Cierra modal al seleccionar
  },

  async abrirModalProductos() {
  this.loading = true;
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${ApiBaseUrl}Product/available`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const productos = await response.json();

    // Ajustar stock descontando lo que ya está en detalleFactura
    this.productosEncontrados = productos.map(producto => {
      const detalleExistente = this.detalleFactura.find(
        item => item.productId === producto.productId
      );

      let stockFinal = producto.stock;
      if (detalleExistente) {
        stockFinal -= detalleExistente.cantidad;
      }

      return {
        ...producto,
        stock: stockFinal
      };
    }).filter(p => p.stock > 0);

    this.productosFiltrados = this.productosEncontrados;
    this.productoFiltro = '';
    this.mostrarModalProductos = true;
  } catch (error) {
    console.error('Error al cargar productos:', error);
    alert('Error al cargar productos. Verifique la conexión con el servidor.');
  } finally {
    this.loading = false;
  }
},

filtrarProductos() {
  const termino = this.productoFiltro.toLowerCase();
  this.productosFiltrados = this.productosEncontrados.filter(producto =>
    producto.name.toLowerCase().includes(termino) ||
    producto.code.toLowerCase().includes(termino)
  );
},


    async buscarProductos() {
  if (!this.productoSearch.trim()) {
    alert('Ingrese un término de búsqueda');
    return;
  }

  this.loading = true;
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${ApiBaseUrl}Product/available`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const productos = await response.json();

    // Filtrar productos por el término de búsqueda
    this.productosEncontrados = productos
      .filter(producto =>
        producto.name.toLowerCase().includes(this.productoSearch.toLowerCase()) ||
        producto.code.toLowerCase().includes(this.productoSearch.toLowerCase())
      )
      .map(producto => {
        const detalleExistente = this.detalleFactura.find(
          item => item.productId === producto.productId
        );

        let stockFinal = producto.stock;
        if (detalleExistente) {
          stockFinal -= detalleExistente.cantidad;
        }

        return {
          ...producto,
          stock: stockFinal
        };
      })
      .filter(producto => producto.stock > 0);

    if (this.productosEncontrados.length === 0) {
      alert('No se encontraron productos con ese criterio o no hay stock disponible');
    } else {
      this.mostrarModalProductos = true;  // Mostrar modal si hay resultados
    }
  } catch (error) {
    console.error('Error al buscar producto:', error);
    alert('Error al buscar producto. Verifique la conexión con el servidor.');
  } finally {
    this.loading = false;
  }
},

    seleccionarProducto(productoSeleccionado) {
      // Solo permite seleccionar si hay stock
      if (productoSeleccionado.stock <= 0) {
        alert('No hay stock disponible para este producto');
        return;
      }
      this.producto = {
        ...this.producto,
        id: productoSeleccionado.productId,
        descripcion: productoSeleccionado.name,
        precioUnitario: productoSeleccionado.unitPrice,
        cantidad: 1,
        stock: productoSeleccionado.stock,
        code: productoSeleccionado.code,
        category: productoSeleccionado.category
      };
      // No limpiar productosEncontrados aquí, para que siga visible la tabla
      this.productoSearch = '';
    },

    agregarProducto() {
  if (!this.producto.descripcion || this.producto.cantidad <= 0) {
    alert('Complete los datos del producto');
    return;
  }

  const productoEnTabla = this.productosEncontrados.find(
    p => p.productId === this.producto.id
  );

  if (!productoEnTabla || this.producto.cantidad > productoEnTabla.stock) {
    alert('Cantidad supera el stock disponible');
    return;
  }

  const detalleExistente = this.detalleFactura.find(
    item => item.productId === this.producto.id
  );

  if (detalleExistente) {
    if (detalleExistente.cantidad + this.producto.cantidad > productoEnTabla.stock) {
      alert('Cantidad total supera el stock disponible');
      return;
    }
    detalleExistente.cantidad += this.producto.cantidad;
  } else {
    this.detalleFactura.push({
      productId: this.producto.id,
      descripcion: this.producto.descripcion,
      precioUnitario: this.producto.precioUnitario,
      cantidad: this.producto.cantidad,
      iva: parseInt(this.producto.iva),
      code: this.producto.code,
      category: this.producto.category
    });
  }

  productoEnTabla.stock -= this.producto.cantidad;

  if (productoEnTabla.stock <= 0) {
    this.productosEncontrados = this.productosEncontrados.filter(
      p => p.productId !== productoEnTabla.productId
    );
  }

  // Limpiar campos y ocultar lista
  this.producto = {
    id: null,
    descripcion: '',
    precioUnitario: 0,
    cantidad: 1,
    iva: '12'
  };
  this.productoSearch = '';
  this.productosEncontrados = [];
},




    eliminarProducto(index) {
      // Devuelve el stock al producto en la tabla
      const item = this.detalleFactura[index];
      const productoEnTabla = this.productosEncontrados.find(
        p => p.productId === item.productId
      );
      if (productoEnTabla) {
        productoEnTabla.stock += item.cantidad;
      }
      this.detalleFactura.splice(index, 1);
    },

    actualizarFactura() {
      // Recalcular totales (se hace automáticamente por computed properties)
      alert('Factura actualizada');
    },

    async guardarFactura() {
      if (this.detalleFactura.length === 0) {
        alert('Agregue al menos un producto');
        return;
      }

      if (!this.cliente.id) {
        alert('Seleccione un cliente');
        return;
      }

      this.saving = true;
      try {
        const salesOrderData = {
          customerId: this.cliente.id,
          orderDetails: this.detalleFactura.map(item => ({
            productId: item.productId,
            unitPrice: item.precioUnitario,
            quantity: item.cantidad
          }))
        };

        const token = localStorage.getItem("token");
        const response = await fetch(`${ApiBaseUrl}SalesOrder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(salesOrderData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        await response.json();
        alert('Factura guardada exitosamente');
        
        // Imprimir la factura
        this.imprimirFactura();
        
        // Limpiar formulario
        this.limpiarFormulario();
        
      } catch (error) {
        console.error('Error al guardar factura:', error);
        alert('Error al guardar la factura. Verifique la conexión con el servidor.');
      } finally {
        this.saving = false;
      }
    },

    imprimirFactura() {
      // Mostrar temporalmente el contenido para imprimir
      const printContent = this.$refs.facturaImpresion;
      printContent.style.display = 'block';
      
      // Crear una nueva ventana para la impresión
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      
      // Escribir el contenido HTML en la nueva ventana
      printWindow.document.write(`
        <html>
          <head>
            <title>Factura ${this.numeroFactura}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .factura-print { max-width: 800px; margin: 0 auto; }
              .print-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 10px; }
              .print-header h1 { margin: 0; font-size: 28px; }
              .print-cliente, .print-detalle { margin-bottom: 30px; }
              .print-cliente h3, .print-detalle h3 { background-color: #f0f0f0; padding: 10px; margin: 0 0 15px 0; }
              .print-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              .print-table th, .print-table td { border: 1px solid #000; padding: 8px; text-align: left; }
              .print-table th { background-color: #f0f0f0; font-weight: bold; }
              .print-totales { margin-top: 30px; }
              .totales-print { float: right; width: 300px; }
              .totales-print p { margin: 5px 0; padding: 5px; }
              .total-print { background-color: #f0f0f0; font-size: 18px; text-align: center; border: 2px solid #000; }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Enfocar la ventana e imprimir
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
      
      // Ocultar nuevamente el contenido de impresión
      printContent.style.display = 'none';
    },

    imprimirFacturaPDF() {
      const doc = new jsPDF();

      // Encabezado
      doc.setFontSize(18);
      doc.text("FACTURA", 105, 15, { align: "center" });
      doc.setFontSize(12);
      doc.text(`Número: ${this.numeroFactura}`, 14, 25);
      doc.text(`Fecha: ${this.fechaActual}`, 150, 25);

      // Datos del cliente
      doc.setFontSize(14);
      doc.text("DATOS DEL CLIENTE", 14, 35);
      doc.setFontSize(11);
      doc.text(`Nombre: ${this.cliente.nombres} ${this.cliente.apellidos}`, 14, 42);
      doc.text(`Cédula: ${this.cliente.cedula}`, 14, 48);
      doc.text(`Teléfono: ${this.cliente.telefono}`, 14, 54);
      doc.text(`Correo: ${this.cliente.correo}`, 14, 60);
      doc.text(`Dirección: ${this.cliente.direccion}`, 14, 66);

      // Detalle de productos
      doc.setFontSize(14);
      doc.text("DETALLE DE PRODUCTOS", 14, 78);

      // Tabla de productos
      const startY = 84;
      let y = startY;
      doc.setFontSize(11);
      doc.text("Cant.", 14, y);
      doc.text("Descripción", 30, y);
      doc.text("P. Unit.", 100, y);
      doc.text("IVA", 130, y);
      doc.text("Total", 150, y);

      y += 6;
      this.detalleFactura.forEach(item => {
        doc.text(String(item.cantidad), 14, y);
        doc.text(String(item.descripcion), 30, y);
        doc.text(`$${item.precioUnitario.toFixed(2)}`, 100, y);
        doc.text(`${item.iva}%`, 130, y);
        const totalItem = (item.cantidad * item.precioUnitario * (1 + item.iva/100)).toFixed(2);
        doc.text(`$${totalItem}`, 150, y);
        y += 6;
        if (y > 270) { // Salto de página si es necesario
          doc.addPage();
          y = 20;
        }
      });

      // Totales
      y += 8;
      doc.setFontSize(12);
      doc.text(`Subtotal 12%: $${this.subtotal12.toFixed(2)}`, 130, y);
      y += 6;
      doc.text(`Subtotal 0%: $${this.subtotal0.toFixed(2)}`, 130, y);
      y += 6;
      doc.text(`Subtotal: $${this.subtotal.toFixed(2)}`, 130, y);
      y += 6;
      doc.text(`IVA 12%: $${this.iva12.toFixed(2)}`, 130, y);
      y += 6;
      doc.setFontSize(14);
      doc.text(`TOTAL A PAGAR: $${this.totalPagar.toFixed(2)}`, 130, y);

      doc.save(`Factura_${this.numeroFactura}.pdf`);
    },

    async obtenerUltimoNumeroFacturaYFecha() {
      try {
        const token = localStorage.getItem("token");
        // Obtener número de factura
        const responseNum = await fetch(`${ApiBaseUrl}SalesOrder/last`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!responseNum.ok) throw new Error('No se pudo obtener el último número de factura');
        const dataNum = await responseNum.json();
        this.numeroFactura = dataNum.numeroFactura ? (parseInt(dataNum.numeroFactura) + 1).toString() : '1';

        // Obtener fecha de factura desde el servidor
        const responseFecha = await fetch(`${ApiBaseUrl}SalesOrder/date`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!responseFecha.ok) throw new Error('No se pudo obtener la fecha del servidor');
        const dataFecha = await responseFecha.json();
        this.fechaFactura = dataFecha.fechaFactura || new Date().toLocaleDateString('es-ES');
      } catch (error) {
        console.error('Error al obtener datos de factura:', error);
        this.numeroFactura = '1';
        this.fechaFactura = new Date().toLocaleDateString('es-ES');
      }
    },

    limpiarFormulario() {
      this.numeroFactura = new Date().getTime().toString();
      this.clienteSearch = '';
      this.productoSearch = '';
      this.clientesEncontrados = [];
      this.productosEncontrados = [];
      this.cliente = {
        id: null,
        nombres: '',
        apellidos: '',
        cedula: '',
        telefono: '',
        correo: '',
        direccion: ''
      };
      this.producto = {
        id: null,
        descripcion: '',
        precioUnitario: 0,
        cantidad: 1,
        iva: '12'
      };
      this.detalleFactura = [];
    }
  }
}
</script>

<style scoped>

.center-zoom-wrapper {
  width: 100vw;
  min-height: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-x: auto;
  background: transparent;
  position: relative;
  height: 100vh; /* Asegura que el wrapper ocupe solo la pantalla */
}


.facturador-container {
  max-width: 1100px;
  padding: 20px;
  font-family: Arial, sans-serif;
  transform: scale(0.67);
  transform-origin: center top;
  width: 149.25%;
  height: auto;
  position: absolute; /* <-- Esto evita que el espacio extra se reserve */
  left: 50%;
  top: 0;
  /* Centra el contenedor escalado */
  transform: translateX(-50%) scale(0.67);
}

.factura-header {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
}

.numero-factura {
  font-weight: bold;
  font-size: 1.2em;
  margin-left: 10px;
}

.section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

.search-container {
  display: flex;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
}

.btn-buscar {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-buscar:hover {
  background-color: #45a049;
}

.btn-buscar:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.clientes-lista, .productos-lista {
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.clientes-lista h3, .productos-lista h3 {
  margin: 0;
  padding: 10px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ddd;
}

.cliente-item, .producto-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.cliente-item:hover, .producto-item:hover {
  background-color: #f5f5f5;
}

.cliente-item:last-child, .producto-item:last-child {
  border-bottom: none;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input, .form-group select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn-agregar {
  padding: 10px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

.btn-agregar:hover {
  background-color: #0b7dda;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.detalle-table {
  width: 100%;
  border-collapse: collapse;
}

.detalle-table th, .detalle-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.detalle-table th {
  background-color: #f2f2f2;
}

.detalle-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.btn-eliminar {
  padding: 5px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-eliminar:hover {
  background-color: #d32f2f;
}

.totales-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 20px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  width: 300px;
  margin-bottom: 10px;
}

.total-final {
  font-weight: bold;
  font-size: 1.1em;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.btn-actualizar {
  padding: 10px 20px;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-actualizar:hover {
  background-color: #e68a00;
}

.btn-guardar {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-guardar:hover {
  background-color: #45a049;
}

.btn-guardar:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Estilos para impresión */
.factura-impresion {
  background: white;
}

@media print {
  .facturador-container {
    display: none;
  }
  
  .factura-impresion {
    display: block !important;
  }
}
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.4);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  background-color: #007bff;
  color: white;
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 15px;
  overflow-y: auto;
}

.modal-table {
  width: 100%;
  border-collapse: collapse;
}

.modal-table th,
.modal-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.modal-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.modal-table tr:hover {
  background-color: #f1f1f1;
  cursor: pointer;
}

.modal-footer {
  padding: 15px;
  display: flex;
  justify-content: flex-end;
  background-color: #f8f9fa;
}

.modal-cerrar {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-cerrar:hover {
  background-color: #c82333;
}


</style>