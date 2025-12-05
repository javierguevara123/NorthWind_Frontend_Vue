<template>
  <div class="full-screen-page">
    <div class="overlay">
      
      <div class="toolbar-container no-print">
        <div class="container-fluid d-flex justify-content-between align-items-center px-4 py-2">
          <button class="btn btn-light rounded-pill shadow-sm fw-bold" @click="$router.push('/order')">
            <i class="fas fa-arrow-left me-2"></i>Volver
          </button>
          
          <div class="d-flex gap-3">
            <button class="btn btn-outline-light rounded-pill fw-bold" @click="imprimirNativo" :disabled="!order">
              <i class="fas fa-print me-2"></i>Imprimir
            </button>
            <button class="btn btn-warning rounded-pill fw-bold shadow-sm text-dark" @click="generarPDF" :disabled="!order">
              <i class="fas fa-file-pdf me-2"></i>Descargar PDF
            </button>
          </div>
        </div>
      </div>

      <div class="preview-area">
        
        <div v-if="loading" class="text-center text-white mt-5">
            <div class="spinner-border text-light" role="status" style="width: 3rem; height: 3rem;"></div>
            <p class="mt-3 fs-5">Cargando factura...</p>
        </div>

        <div v-else-if="error" class="alert alert-danger m-5 shadow-lg text-center">
            {{ error }}
            <button class="btn btn-outline-danger mt-2 d-block mx-auto" @click="cargarOrden($route.params.id)">Reintentar</button>
        </div>

        <div v-else-if="order" id="element-to-print" class="invoice-paper shadow-lg d-flex flex-column">
            
            <header class="invoice-header mb-3">
                <div class="row align-items-center">
                    <div class="col-7">
                        <h1 class="invoice-title text-uppercase">Factura</h1>
                        <div class="invoice-meta mt-2">
                            <p class="mb-1">N.º: <strong class="text-dark">{{ order.orderId }}</strong></p>
                            <p class="mb-0">Fecha: <strong>{{ formatearFecha(order.orderDate) }}</strong></p>
                        </div>
                    </div>
                    <div class="col-5 text-end">
                         <div class="logo-box">
                            <h2 class="fw-bold text-primary m-0">NorthWind</h2>
                            <small class="text-muted d-block">RUC: 1790012345001</small>
                         </div>
                    </div>
                </div>
            </header>

            <hr class="my-2 border-2 border-dark">

            <section class="invoice-info mb-3">
                <h5 class="text-uppercase fw-bold mb-1 text-dark">{{ order.customerName }}</h5>
                <div class="row">
                    <div class="col-6">
                        <p class="mb-0 text-muted small"><strong>ID:</strong> {{ order.customerId }}</p>
                        <p class="mb-0 text-muted small">{{ order.shipAddress }}</p>
                    </div>
                    <div class="col-6">
                        <p class="mb-0 text-muted small">{{ order.shipCity }}, {{ order.shipCountry }}</p>
                        <p class="mb-0 text-muted small" v-if="order.shipPostalCode">CP: {{ order.shipPostalCode }}</p>
                    </div>
                </div>
            </section>

            <section class="items-section flex-grow-1">
                <table class="clean-table w-100">
                    <thead>
                        <tr>
                            <th class="text-start" style="width: 45%">ARTÍCULO</th>
                            <th class="text-center" style="width: 15%">CANT.</th>
                            <th class="text-end" style="width: 20%">PRECIO</th>
                            <th class="text-end" style="width: 20%">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in order.orderDetails" :key="index">
                            <td class="text-start py-2">{{ item.productName }}</td>
                            <td class="text-center py-2">{{ item.quantity }}</td>
                            <td class="text-end py-2">${{ item.unitPrice.toFixed(2) }}</td>
                            <td class="text-end py-2 fw-bold">${{ item.subtotal.toFixed(2) }}</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section class="bottom-section mt-auto">
                
                <div class="row justify-content-end mb-3">
                    <div class="col-6 col-md-5">
                        <div class="totals-box pt-2 border-top border-dark">
                            <div class="d-flex justify-content-between py-1">
                                <span class="text-muted small">Subtotal:</span>
                                <span class="fw-bold small">${{ order.totalAmount.toFixed(2) }}</span>
                            </div>
                            <div class="d-flex justify-content-between py-1">
                                <span class="text-muted small">Impuestos (0%):</span>
                                <span class="fw-bold small">$0.00</span>
                            </div>
                            <div class="d-flex justify-content-between py-2 mt-2 border-top">
                                <span class="fs-5 fw-bold text-dark">Total:</span>
                                <span class="fs-5 fw-bold text-dark">${{ order.totalAmount.toFixed(2) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="footer-content pt-3 border-top border-secondary">
                    <h6 class="fw-bold mb-2">¡Gracias por su compra!</h6>
                    <div class="row text-muted" style="font-size: 0.75rem;">
                        <div class="col-6">
                            <strong>Información de pago</strong><br>
                            Banco del Austro | Cta: 1234567890
                        </div>
                        <div class="col-6 text-end">
                            <strong>Contacto</strong><br>
                            www.northwind.com | info@northwind.com
                        </div>
                    </div>
                </div>

            </section>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
import html2pdf from 'html2pdf.js';

const ApiBaseUrl = 'http://northwindweb.somee.com';

export default {
  name: 'PrintInvoice',
  data() {
    return {
      order: null,
      loading: true,
      error: null
    }
  },
  async mounted() {
    const orderId = this.$route.params.id;
    if (orderId) {
        await this.cargarOrden(orderId);
    } else {
        this.error = "No se especificó un número de orden.";
        this.loading = false;
    }
  },
  methods: {
    async cargarOrden(id) {
        this.loading = true;
        this.error = null;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${ApiBaseUrl}/GetOrderById/${id}`, {
                headers: { 'accept': 'application/json', 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("No se pudo encontrar la orden solicitada.");
            
            this.order = await res.json();

        } catch (e) {
            console.error(e);
            this.error = "Error al cargar la información de la factura.";
        } finally {
            this.loading = false;
        }
    },

    formatearFecha(fechaStr) {
        if(!fechaStr) return '---';
        return new Date(fechaStr).toLocaleDateString('es-ES', { 
            year: 'numeric', month: '2-digit', day: '2-digit'
        });
    },

    generarPDF() {
        if (!this.order) return;
        const element = document.getElementById('element-to-print');
        const opt = {
          margin:       0, // Sin márgenes, el CSS controla el padding
          filename:     `Factura_${this.order.orderId}.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true, scrollY: 0 },
          jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    },

    imprimirNativo() {
        window.print();
    }
  }
}
</script>

<style scoped>
/* === VISTA EN PANTALLA === */
.full-screen-page {
  position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
  background-color: #525659; z-index: 1000; overflow-y: auto;
}
.overlay { min-height: 100%; display: flex; flex-direction: column; }
.toolbar-container {
    background: #323639; position: sticky; top: 0; z-index: 1000;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
.preview-area {
    flex: 1; display: flex; justify-content: center; padding: 40px 0;
}

/* === HOJA A4 === */
.invoice-paper {
    background: white;
    width: 210mm;
    min-height: 297mm;
    padding: 15mm; /* Margen interno seguro */
    position: relative;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
}

/* Estilos Tabla */
.clean-table { border-collapse: collapse; width: 100%; margin-top: 10px; }
.clean-table th { 
    border-top: 2px solid #000; border-bottom: 2px solid #000;
    padding: 8px 5px; font-weight: 700; font-size: 0.8rem; letter-spacing: 0.5px;
}
.clean-table td { border-bottom: 1px solid #eee; font-size: 0.9rem; }

/* === OPTIMIZACIÓN DE IMPRESIÓN (EL FIX) === */
@media print {
  /* Ocultar UI */
  .no-print, .toolbar-container { display: none !important; }
  
  /* Resetear contenedores */
  .full-screen-page, .overlay, .preview-area {
      position: static !important;
      width: 100% !important;
      height: auto !important;
      background: none !important;
      overflow: visible !important;
      padding: 0 !important;
      margin: 0 !important;
      display: block !important;
  }

  /* Ajustar Hoja al Papel */
  .invoice-paper {
      box-shadow: none !important;
      margin: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
      
      /* IMPORTANTE: Forzar altura automática para evitar el salto de página innecesario */
      min-height: auto !important; 
      height: auto !important;
      
      /* Reducir padding para ganar espacio si es necesario */
      padding: 10mm !important; 
      
      page-break-inside: avoid;
  }

  /* Asegurar que los elementos no se rompan mal */
  .header-section, .client-section, .totals-section, .footer-section {
      page-break-inside: avoid;
  }

  /* Escalar para ajustar (Fit to Page) */
  body {
      zoom: 0.9; /* Reduce al 90% para asegurar que quepa con los márgenes de la impresora */
      -webkit-print-color-adjust: exact;
  }
  
  /* Ocultar encabezados/pies del navegador (Chrome/Edge) */
  @page {
      margin: 5mm; /* Márgenes mínimos del papel */
      size: auto; 
  }
}
</style>