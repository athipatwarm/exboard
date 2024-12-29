import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,  // Default state
  }),
  actions: {
    // Check if user is authenticated
    async checkAuth() {
      const token = this.getCookie('token');  // Use 'token' cookie for authentication
      this.isAuthenticated = !!token;  // Update state based on token presence
    },

    // Login user and set authentication token
    async login(email, password) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password });
        document.cookie = `token=${response.data.token}; path=/;`;  // Set JWT token in 'token' cookie
        this.isAuthenticated = true;  // Set authenticated state to true
      } catch (error) {
        throw new Error('Login failed');
      }
    },

    // Logout user and clear authentication token
    async logout() {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {}, {
          headers: {
            Authorization: `Bearer ${this.getCookie('token')}`,
          },
        });
        document.cookie = 'token=; Max-Age=0; path=/;';  // Remove 'token' cookie on logout
        this.isAuthenticated = false;  // Clear the authenticated state
      } catch (error) {
        console.error('Logout failed', error);
      }
    },

    // Utility function to get cookie by name
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    },
  },
});
