<template>
  <div class="register-page">
    <!-- Modal de éxito -->
    <div class="modal fade" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title" id="successModalLabel">¡Registro exitoso!</h5>
          </div>
          <div class="modal-body">
            Tu cuenta ha sido creada correctamente. Serás redirigido al login.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success w-100" @click="redirectToLogin">
              Ir al Login
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario de registro -->
    <div class="overlay d-flex justify-content-center align-items-center min-vh-100">
      <div class="card shadow-lg border-0" style="width: 100%; max-width: 400px;">
        <div class="card-body p-4">
          <div class="text-center mb-4">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Register Icon" width="60" class="mb-2" />
            <h2 class="mb-0 fw-bold">Crear Cuenta</h2>
            <p class="text-muted mb-0" style="font-size: 0.95rem;">Regístrate para continuar</p>
          </div>
          <form @submit.prevent="register" autocomplete="off" novalidate>
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
                placeholder="Crea una contraseña"
                minlength="10"
                maxlength="10"
              />
              <div v-if="passwordError" class="invalid-feedback">
                {{ passwordError }}
              </div>
            </div>

            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Confirmar contraseña</label>
              <input
                v-model="confirmPassword"
                type="password"
                class="form-control"
                :class="{ 'is-invalid': confirmPasswordError }"
                id="confirmPassword"
                placeholder="Repite tu contraseña"
                minlength="10"
                maxlength="10"
              />
              <div v-if="confirmPasswordError" class="invalid-feedback">
                {{ confirmPasswordError }}
              </div>
            </div>

            <div class="mb-3">
              <label for="cedula" class="form-label">Cédula</label>
              <input
                v-model="cedula"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': cedulaError }"
                id="cedula"
                placeholder="Ingresa tu cédula"
                minlength="10"
                maxlength="10"
              />
              <div v-if="cedulaError" class="invalid-feedback">
                {{ cedulaError }}
              </div>
            </div>

            <div
              v-if="registerError"
              class="alert alert-danger small text-center p-2"
            >
              {{ registerError }}
            </div>

            <button type="submit" class="btn btn-primary w-100 fw-bold" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              Registrarse
            </button>
          </form>

          <div class="text-center mt-3">
            <router-link to="/login" class="small text-decoration-none text-secondary">
              ¿Ya tienes cuenta? Inicia sesión
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterForm',
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      cedula: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
      cedulaError: '',
      registerError: '',
      loading: false
    };
  },
  methods: {
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    validatePassword(password) {
      const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      return re.test(password);
    },
    validateCedula(cedula) {
      const re = /^\d{10}$/;
      return re.test(cedula);
    },
    showSuccessModal() {
      const modalEl = document.getElementById('successModal');
      if (modalEl && window.bootstrap) {
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
      }
    },
    redirectToLogin() {
      const modalEl = document.getElementById('successModal');
      if (modalEl && window.bootstrap) {
        const modal = window.bootstrap.Modal.getInstance(modalEl);
        if (modal) {
          modal.hide();
        }
      }
      setTimeout(() => {
        this.$router.push('/login');
      }, 300);
    },
    async register() {
      // Reset errores
      this.emailError = '';
      this.passwordError = '';
      this.confirmPasswordError = '';
      this.cedulaError = '';
      this.registerError = '';
      this.loading = true;

      // Validaciones frontend
      if (!this.email) {
        this.emailError = 'El correo es obligatorio.';
      } else if (!this.validateEmail(this.email)) {
        this.emailError = 'El correo no tiene un formato válido.';
      }

      if (!this.password) {
        this.passwordError = 'La contraseña es obligatoria.';
      } else if (this.password.length < 10) {
        this.passwordError = 'La contraseña debe tener mínimo 10 caracteres.';
      } else if (!this.validatePassword(this.password)) {
        this.passwordError = 'La contraseña debe incluir mayúsculas, minúsculas, números y símbolos.';
      }

      if (!this.confirmPassword) {
        this.confirmPasswordError = 'Debes confirmar tu contraseña.';
      } else if (this.password !== this.confirmPassword) {
        this.confirmPasswordError = 'Las contraseñas no coinciden.';
      }

      if (!this.cedula) {
        this.cedulaError = 'La cédula es obligatoria.';
      } else if (this.cedula.length < 10) {
        this.cedulaError = 'La cédula debe tener exactamente 10 dígitos.';
      } else if (!this.validateCedula(this.cedula)) {
        this.cedulaError = 'La cédula debe contener solo números.';
      }

      if (this.emailError || this.passwordError || this.confirmPasswordError || this.cedulaError) {
        this.loading = false;
        return;
      }

      // Si pasa validaciones locales, hacer petición backend
      try {
        const response = await fetch('http://localhost:5265/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.email.toLowerCase(),
            password: this.password,
            cedula: this.cedula
          })
        });

        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }

        if (response.ok) {
          // Limpiar formulario
          this.email = '';
          this.password = '';
          this.confirmPassword = '';
          this.cedula = '';
          
          this.showSuccessModal();
        } else {
          // Manejar diferentes tipos de error del backend
          if (typeof data === 'object' && data.errors) {
            // Error de validación con formato estructurado
            if (data.errors.Password) {
              this.passwordError = data.errors.Password[0];
            }
            if (data.errors.Email) {
              this.emailError = data.errors.Email[0];
            }
            if (data.errors.Cedula) {
              this.cedulaError = data.errors.Cedula[0];
            }
            // Si hay errores generales
            if (data.title && !this.passwordError && !this.emailError && !this.cedulaError) {
              this.registerError = data.title;
            }
          } else if (typeof data === 'string') {
            // Error como texto plano
            const errorText = data.toLowerCase();
            if (errorText.includes('cédula') || errorText.includes('cedula')) {
              this.cedulaError = data;
            } else if (errorText.includes('correo') || errorText.includes('email')) {
              this.emailError = data;
            } else if (errorText.includes('contraseña') || errorText.includes('password')) {
              this.passwordError = data;
            } else {
              this.registerError = data;
            }
          } else {
            this.registerError = data.message || 'Error al registrar usuario';
          }
        }
      } catch (error) {
        console.error('Error de registro:', error);
        this.registerError = 'Error de conexión con el servidor.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.register-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('https://images.unsplash.com/photo-1494172961521-33799ddd43a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
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