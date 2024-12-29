<template>
  <header>
    <nav>
      <!-- Left Section for Home and Topic -->
      <div class="left">
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/topics">Topic</router-link></li>
        </ul>
      </div>

      <!-- Right Section for Login/Register or Logout/Profile -->
      <div class="right">
        <ul>
          <li v-if="!auth.isAuthenticated"><router-link to="/login">Login</router-link></li>
          <li v-if="!auth.isAuthenticated"><router-link to="/register">Register</router-link></li>
          <li v-if="auth.isAuthenticated"><router-link to="/profile">Profile</router-link></li>
          <li v-if="auth.isAuthenticated"><button @click="logout">Logout</button></li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useAuthStore } from '../store/auth';
import { onMounted } from 'vue';

// Initialize the auth store
const auth = useAuthStore();

onMounted(() => {
  auth.checkAuth();
});

const logout = () => {
  auth.logout();
};
</script>

<style scoped>
header {
  background-color: #808080;
  color: white;
  padding: 10px 20px;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav .left ul,
nav .right ul {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
}

nav .left li,
nav .right li {
  margin: 0 10px;
}

router-link {
  color: white;
  text-decoration: none;
}

button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

button:hover {
  background-color: #d32f2f;
}

nav .left {
  flex: 1;
}

nav .right {
  display: flex;
  justify-content: flex-end;
}
</style>
