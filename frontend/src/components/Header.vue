<template>
  <header>
    <nav>
      <!-- Left Section for Home and Topic -->
      <div class="left">
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/topic">Topic</router-link></li>
        </ul>
      </div>

      <!-- Right Section for Login/Register or Logout/Profile -->
      <div class="right">
        <ul>
          <!-- If the user is not authenticated, show Login/Register -->
          <li v-if="!isAuthenticated"><router-link to="/login">Login</router-link></li>
          <li v-if="!isAuthenticated"><router-link to="/register">Register</router-link></li>

          <!-- If the user is authenticated, show Profile/Logout -->
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
import { ref, onMounted, onBeforeUnmount } from 'vue';  // onBeforeUnmount to safely remove the listener

// Reactive variable to track authentication state
const isAuthenticated = ref(false);

// Function to check authentication status from localStorage
const checkAuth = () => {
  const token = localStorage.getItem('token');
  isAuthenticated.value = !!token;  // Set to true if token exists, otherwise false
};

// Logout function to clear the token and update authentication state
const logout = async () => {
  try {
    // Send a request to the backend to invalidate the token
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.status === 200) {
      // If the logout is successful, clear the localStorage and update the auth state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      isAuthenticated.value = false;

      // Optionally redirect the user to the home or login page
      router.push('/login');
    }
  } catch (error) {
    console.error('Logout failed', error);
  }
};


// Listen for the custom event that signals a change in authentication status
onMounted(() => {
  // Check initial authentication state
  checkAuth();

  // Add event listener for 'auth-changed'
  window.addEventListener('auth-changed', checkAuth);
});

// Remove the event listener safely before unmounting the component
onBeforeUnmount(() => {
  window.removeEventListener('auth-changed', checkAuth);
});
</script>

<style scoped>
header {
  background-color: #808080;  /* Set background color to grey */
  color: white;
  padding: 10px 20px;
}

nav {
  display: flex;
  justify-content: space-between;  /* This will space out the left and right sections */
  align-items: center;  /* This ensures vertical alignment */
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

/* Align left and right sections */
nav .left {
  flex: 1;  /* Take up as much space as possible */
}

nav .right {
  display: flex;
  justify-content: flex-end;  /* Align items to the right */
}
</style>
