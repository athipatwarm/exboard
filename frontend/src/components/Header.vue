<template>
  <header>
    <nav>
      <!-- Left Section for Home and Topic -->
      <div class="left">
        <ul>
          <li><button @click="navigateTo('/')">Home</button></li>
          <li><button @click="navigateTo('/topics')">Topics</button></li>
        </ul>
      </div>

      <!-- Right Section for Login/Register or Logout/Profile -->
      <div class="right">
        <ul>
          <li v-if="!auth.isAuthenticated"><button @click="navigateTo('/login')">Login</button></li>
          <li v-if="!auth.isAuthenticated"><button @click="navigateTo('/register')">Register</button></li>
          <li v-if="auth.isAuthenticated"><button @click="navigateTo('/profile')">Profile</button></li>
          <li v-if="auth.isAuthenticated"><button @click="logout" class="logout">Logout</button></li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'; // Import useRouter hook
import { useAuthStore } from '../store/auth'; // Import auth store

// Initialize the auth store and router
const auth = useAuthStore();
const router = useRouter();

// Immediately check authentication when the component is created
auth.checkAuth();

// Navigate to a specific route
const navigateTo = (route) => {
  router.push(route); // Use Vue Router to navigate programmatically
};

// Logout handler
const logout = () => {
  auth.logout();
  router.push('/'); // Redirect to home after logout (or any other page)
};
</script>

<style scoped>
/* General header styling */
header {
  background-color: #fff; /* Clean white background */
  color: #333; /* Darker text for contrast */
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav {
  width: 100%;
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
  margin: 0 15px;
}

nav button {
  background: transparent;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  border: none;
  padding: 8px 18px;
  border-radius: 30px; /* Smooth rounded edges */
  cursor: pointer;
  transition: all 0.3s ease;
}

nav button:hover {
  background-color: #f0f0f0; /* Subtle hover effect */
}

nav .right ul {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
}

nav .right li {
  margin: 0 15px;
}

nav .logout {
  background-color: #e57373; /* Red background for logout */
  color: white;
  padding: 8px 18px;
  border-radius: 30px;
}

nav .logout:hover {
  background-color: #f44336; /* Darker red on hover */
}

/* Mobile responsiveness */
@media (max-width: 768px) {
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
