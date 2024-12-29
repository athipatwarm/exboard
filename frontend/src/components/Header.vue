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
          <li v-if="!isAuthenticated"><router-link to="/login">Login</router-link></li>
          <li v-if="!isAuthenticated"><router-link to="/register">Register</router-link></li>
          <li v-if="isAuthenticated"><router-link to="/profile">Profile</router-link></li>
          <li v-if="isAuthenticated"><button @click="logout">Logout</button></li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Reactive variable for authentication status
const isAuthenticated = ref(false);

// Utility function to get a cookie value by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Check authentication status by reading the cookie
const checkAuth = () => {
  const token = getCookie('auth_token');
  isAuthenticated.value = !!token; // Set to true if token exists
};

// Router instance
const router = useRouter();

// Logout function
const logout = async () => {
  try {
    // Send logout request to the server
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {}, {
      headers: {
        Authorization: `Bearer ${getCookie('auth_token')}`,
      },
    });

    if (response.status === 200) {
      // Clear the authentication cookie
      document.cookie = 'auth_token=; Max-Age=0; path=/;';

      // Update authentication state
      isAuthenticated.value = false;

      // Notify the app about the authentication state change
      window.dispatchEvent(new Event('auth-changed'));

      // Redirect to the login page
      router.push('/login');
    }
  } catch (error) {
    console.error('Logout failed', error);
  }
};

// Listen for authentication state changes
onMounted(() => {
  checkAuth();

  // Listen for the custom "auth-changed" event
  window.addEventListener('auth-changed', checkAuth);
});

onBeforeUnmount(() => {
  // Remove the event listener
  window.removeEventListener('auth-changed', checkAuth);
});
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
