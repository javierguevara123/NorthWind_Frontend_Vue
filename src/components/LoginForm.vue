<template>
  <div class="login-page">
    <div
      class="overlay d-flex justify-content-center align-items-center min-vh-100"
    >
      <div
        class="card shadow-lg border-0"
        style="width: 100%; max-width: 400px"
      >
        <div class="card-body p-4">
          <div class="text-center mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/747/747545.png"
              alt="Login Icon"
              width="60"
              class="mb-2"
            />
            <h2 class="mb-0 fw-bold">Bienvenido</h2>
            <p class="text-muted mb-0" style="font-size: 0.95rem">
              Inicia sesión para continuar
            </p>
          </div>

          <form @submit.prevent="login" autocomplete="off">
            <div class="mb-3">
              <label for="email" class="form-label">Correo electrónico</label>
              <input
                v-model="email"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': emailError }"
                id="email"
                placeholder="Ingresa tu correo"
              />
              <div v-if="emailError" class="invalid-feedback">
                {{ emailError }}
              </div>
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Contraseña</label>
              <input
                v-model="password"
                type="password"
                class="form-control"
                :class="{ 'is-invalid': passwordError }"
                id="password"
                placeholder="Ingresa tu contraseña"
              />
              <div v-if="passwordError" class="invalid-feedback">
                {{ passwordError }}
              </div>
            </div>

            <div
              v-if="loginError"
              class="alert alert-danger small text-center p-2"
            >
              {{ loginError }}
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100 fw-bold"
              :disabled="loading"
            >
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              Entrar
            </button>
          </form>

          <div class="text-center mt-3">
            <router-link
              to="/register"
              class="small text-decoration-none text-secondary"
            >
              ¿No tienes cuenta? Regístrate
            </router-link>
            <br />
            <a
              href="#"
              class="small text-decoration-none text-secondary mt-2 d-block"
              >¿Olvidaste tu contraseña?</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { jwtDecode } from "jwt-decode";

export default {
  name: "LoginForm",
  data() {
    return {
      email: "",
      password: "",
      emailError: "",
      passwordError: "",
      loginError: "",
      loading: false,
    };
  },
  methods: {
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    async login() {
      this.emailError = "";
      this.passwordError = "";
      this.loginError = "";
      this.loading = true;

      // Validaciones frontend
      if (!this.email) {
        this.emailError = "El correo es obligatorio.";
      } else if (!this.validateEmail(this.email)) {
        this.emailError = "El correo no tiene un formato válido.";
      }

      if (!this.password) {
        this.passwordError = "La contraseña es obligatoria.";
      }

      if (this.emailError || this.passwordError) {
        this.loading = false;
        return;
      }

      try {
        const response = await fetch("http://localhost:5265/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          localStorage.setItem("token", data.token);
          
          const decoded = jwtDecode(data.token);
          const role =
            decoded[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];
          localStorage.setItem("role", role);
          localStorage.setItem("email", this.email);
          
          if (role === "Admin") {
            this.$router.push("/menuAdmin");
          } else if (role === "Usuario") {
            this.$router.push("/menuPrincipal");
          } else {
            this.loginError = "Rol no permitido.";
          }
        } else {
          this.loginError = data.message || "Correo o contraseña incorrectos.";
        }
      } catch (error) {
        console.error(error);
        this.loginError = "Error de conexión con el servidor.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url("@/assets/images/login-bg.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: auto;
}

.overlay {
  width: 100%;
  min-height: 100vh;
  background-color: rgba(255, 255, 255, 0.85);
  padding: 20px;
}

.card {
  border-radius: 1rem;
}
</style>