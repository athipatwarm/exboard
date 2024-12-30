<template>
  <header>
    <nav>
      <div class="left">
        <ul>
          <li><button @click="navigateTo('/')">Home</button></li>
          <li><button @click="navigateTo('/topics')">Topics</button></li>
        </ul>
      </div>

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
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

const auth = useAuthStore();
const router = useRouter();

auth.checkAuth();  // Make sure to check authentication when the component is created

// Log auth status to console
console.log('Auth Status in Header:', auth.isAuthenticated);

// Navigate to a specific route
const navigateTo = (route) => {
  console.log(`Navigating to ${route}`); // Log navigation route
  router.push(route);
};

// Logout handler
const logout = () => {
  auth.logout();
  console.log('User logged out');
  router.push('/'); // Redirect to home after logout
};
</script>

<style scoped>
/* General header styling */
header {
  background-color: #fff; 
  color: #333; 
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
  background-color: #e57373; 
  color: white;
  padding: 8px 18px;
  border-radius: 30px;
}

nav .logout:hover {
  background-color: #f44336; 
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
