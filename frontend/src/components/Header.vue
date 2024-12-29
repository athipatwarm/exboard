<template>
  <header>
    <nav>
      <!-- Left Section for Home and Topic -->
      <div class="left">
        <ul>
          <li><router-link to="/" class="nav-button">Home</router-link></li>
          <li><router-link to="/topics" class="nav-button">Topics</router-link></li>
        </ul>
      </div>

      <!-- Right Section for Login/Register or Logout/Profile -->
      <div class="right">
        <ul>
          <li v-if="!auth.isAuthenticated"><router-link to="/login" class="nav-button">Login</router-link></li>
          <li v-if="!auth.isAuthenticated"><router-link to="/register" class="nav-button">Register</router-link></li>
          <li v-if="auth.isAuthenticated"><router-link to="/profile" class="nav-button">Profile</router-link></li>
          <li v-if="auth.isAuthenticated"><button @click="logout" class="nav-button">Logout</button></li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useAuthStore } from '../store/auth'; // Import auth store

// Initialize the auth store
const auth = useAuthStore();

// Immediately check authentication when the component is created
auth.checkAuth();

// Logout handler
const logout = () => {
  auth.logout();
};
</script>

<style scoped>
/* ...styles remain the same... */
</style>


<style scoped>
/* General header styling */
header {
  background-color: #f5f5f5; /* Light grey background for a fresh, airy feel */
  color: #333; /* Darker text for contrast */
  padding: 20px 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
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
  margin: 0 25px;
}

nav .left router-link,
nav .right router-link {
  color: white; /* White text for the links/buttons */
  font-size: 16px;
  font-weight: 600; /* Bold font weight for emphasis */
  text-decoration: none; /* Remove underline */
  font-family: 'Arial', sans-serif; /* Custom font */
  padding: 10px 20px; /* Space inside the button */
  border-radius: 25px; /* Rounded corners for buttons */
  background-color: #b0bec5; /* Darker grey than the navbar */
  transition: all 0.3s ease; /* Smooth transitions */
  display: inline-block; /* Ensure it's displayed as a block element */
  cursor: pointer; /* Show pointer cursor on hover */
}

nav .left router-link:hover,
nav .right router-link:hover {
  background-color: #90a4ae; /* Darker grey on hover */
}

/* Right section of the navbar */
nav .right ul {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
}

nav .right li {
  margin: 0 20px;
}

nav .right button {
  background-color: #ff9800; /* Soft orange color for logout button */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px; /* Rounded corners for logout button */
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

nav .right button:hover {
  background-color: #e68900; /* Darker orange on hover */
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
