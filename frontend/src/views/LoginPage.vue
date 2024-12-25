<template>
  <div class="login-page">
    <h1>Login Page</h1>

    <form @submit.prevent="loginUser">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>

      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>

      <div>
        <button type="submit">Login</button>
      </div>

      <!-- Display error message -->
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script setup>
  import axios from 'axios';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const email = ref('');
  const password = ref('');
  const errorMessage = ref('');
  const router = useRouter();

  const loginUser = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        email: email.value,
        password: password.value
      });
      
      // Store the token and user info in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Update the authentication state and redirect
      // Use router to go to home page or dashboard
      router.push('/');
      
      // Triggering a reactivity update for isAuthenticated in the header
      window.dispatchEvent(new Event('auth-changed'));  // Trigger event

    } catch (err) {
      // Handle login failure
      errorMessage.value = 'Invalid login credentials';
      password.value = '';  // Clear the password input
    }
  };
</script>

<style scoped>
    .login-page {
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    
    h1 {
      text-align: center;
      margin-bottom: 20px;
    }
    
    form {
      display: flex;
      flex-direction: column;
    }
    
    label {
      margin-bottom: 5px;
    }
    
    input {
      margin-bottom: 15px;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    
    button {
      padding: 10px;
      background-color: #4caf50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button:hover {
      background-color: #45a049;
    }
    
    .error-message {
      color: red;
      font-size: 14px;
      margin-top: 10px;
    }
</style>
