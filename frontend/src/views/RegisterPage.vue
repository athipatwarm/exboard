<template>
  <div class="register-page">
    <h1>Register Page</h1>
    
    <form @submit.prevent="registerUser">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required />
      </div>

      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>

      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>

      <div>
        <button type="submit">Register</button>
      </div>
      
      <!-- Display error message -->
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Declare form fields and error message
const username = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');

// Register user function
const registerUser = async () => {
  try {
    // Sending POST request to the backend to register a new user
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
      username: username.value,
      email: email.value,
      password: password.value,
    });

    // If registration is successful, reset form fields and show a success message
    console.log('User registered successfully:', response.data);

    // Show success alert
    alert('Registration successful! Please log in.');

    // Clear input fields
    username.value = '';
    email.value = '';
    password.value = '';

    // Optionally, redirect to login page
    // Example: router.push('/login'); if using Vue Router
  } catch (error) {
    // If there was an error (e.g., username/email already exists), show the error message
    errorMessage.value = error.response?.data?.error || 'Registration failed. Please try again.';
  }
};
</script>

<style scoped>
.register-page {
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
