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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

const auth = useAuthStore();
const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');

// Handle user login
const loginUser = async () => {
  try {
    await auth.login(email.value, password.value); // Call login from auth store
    router.push('/'); // Redirect to home page after login
  } catch (error) {
    errorMessage.value = 'Invalid login credentials'; // Display error message
    password.value = ''; // Clear the password field
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
