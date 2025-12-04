import { createRouter, createWebHistory } from "vue-router";
import LoginForm from "../components/LoginForm.vue";
import RegisterForm from "../components/RegisterForm.vue";
import MenuPrincipal from "../components/MenuPrincipal.vue";
import MenuAdmin from "../components/MenuAdmin.vue";
import GestionUsuarios from "../components/GestionUsuarios.vue";
import GestionProductos from "../components/GestionProductos.vue";
import OrderForm from "../components/OrderForm.vue";
import GestionClientes from "../components/GestionClientes.vue";
import DesbloquearCuentas from "../components/DesbloquearCuentas.vue";
import ReporteErrores from "../components/ReporteErrores.vue";
import PerfilUsuario from "../components/PerfilUsuario.vue";
import ListadoFacturas from "../components/ListadoFacturas.vue";
import SelectProductos from "@/components/SelectProductos.vue";
import SelectClientes from "@/components/SelectClientes.vue";
import PrintInvoice from "@/components/PrintInvoice.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginForm },
  { path: "/register", component: RegisterForm },
  { path: "/menuPrincipal", component: MenuPrincipal },
  { path: "/menuAdmin", component: MenuAdmin },
  { path: "/gestionUsuarios", component: GestionUsuarios },
  { path: "/productos", component: GestionProductos },
  { path: "/order", component: OrderForm },
  { path: "/gestionClientes", component: GestionClientes },
  { path: "/desbloquearCuentas", component: DesbloquearCuentas },
  { path: "/reporteErrores", component: ReporteErrores },
  { path: "/perfil", component: PerfilUsuario },
  { path: "/facturas", component: ListadoFacturas },
  { path: "/selectProductos", component: SelectProductos },
  { path: "/selectClientes", component: SelectClientes },
  { 
    path: "/print-invoice/:id", // El :id es vital para recibir el número de orden
    name: "PrintInvoice",       // El nombre debe coincidir con el push del router
    component: PrintInvoice,
    props: true                 // Permite pasar el ID como prop si se necesita
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
