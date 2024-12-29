<template>
  <header>
    <nav>
      <!-- Left Section for Home and Topic -->
      <div class="left">
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/topics">Topics</router-link></li>
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
import { onMounted } from 'vue';
import { useAuthStore } from '../store/auth'; // Import auth store

// Initialize the auth store
const auth = useAuthStore();

// Check authentication status on mounted
onMounted(() => {
  auth.checkAuth();
});

// Logout handler
const logout = () => {
  auth.logout();
};
</script>

<style scoped>
/* General header styling */
header {
  background-color: #1f1f1f; /* Dark background for a modern look */
  color: #fff; /* White text for contrast */
  padding: 15px 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Left section of the navbar */
nav .left ul {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
}

nav .left li {
  margin: 0 20px;
}

nav .left router-link {
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
}

nav .left router-link:hover {
  color: #42b883; /* Highlight color on hover */
}

/* Right section of the navbar */
nav .right ul {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
}

nav .right li {
  margin: 0 15px;
}

nav .right router-link {
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
}

nav .right router-link:hover {
  color: #42b883; /* Highlight color on hover */
}

/* Button Styling */
button {
  background-color: #f44336; /* Red background for logout */
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 25px; /* Rounded corners for modern style */
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button:hover {
  background-color: #d32f2f; /* Darker red on hover */
  transform: scale(1.05); /* Slightly enlarge the button on hover */
}

/* Flexbox layout adjustments */
nav .left {
  flex: 1;
}

nav .right {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  /* Mobile responsiveness */
  nav {
    flex-direction: column;
    align-items: flex-start;
  }

  nav .left ul,
  nav .right ul {
    flex-direction: column;
    align-items: flex-start;
  }

  nav .left li,
  nav .right li {
    margin: 5px 0;
  }
}
</style>
