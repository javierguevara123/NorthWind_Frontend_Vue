<template>
  <div class="container py-4">
    <h2 class="mb-3">Perfil del Usuario</h2>
    <ul class="list-group">
      <li class="list-group-item"><strong>Email:</strong> {{ email }}</li>
      <li class="list-group-item"><strong>Rol:</strong> {{ role }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "PerfilUsuario",
  data() {
    return {
      email: localStorage.getItem("email") || "",
      role: localStorage.getItem("role") || "",
    };
  },
};
</script>
