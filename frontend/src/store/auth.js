import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false, // Default state
  }),
  actions: {
    // Check if user is authenticated from localStorage or cookies
    checkAuth() {
      const token = this.getCookie('token');  // Get the token from cookies (if any)
      if (token) {
        this.isAuthenticated = true;
      } else {
        // Check if token is in localStorage
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          this.isAuthenticated = true;
          this.setCookie('token', storedToken); // Set the cookie again if needed
        }
      }
    },

    // Login user and set authentication token
    async login(email, password) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password });
        const token = response.data.token;
        
        // Store the token in localStorage and the cookie
        localStorage.setItem('token', token); // Store token in localStorage
        document.cookie = `token=${token}; path=/;`; // Store token in cookie
        this.isAuthenticated = true;
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
        
        // Remove token from localStorage and cookies
        localStorage.removeItem('token'); // Remove token from localStorage
        document.cookie = 'token=; Max-Age=0; path=/;';  // Remove token from cookies
        this.isAuthenticated = false;  // Clear authenticated state
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

    // Utility function to set cookie
    setCookie(name, value, days = 7) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Expires in 'days' days
      const expires = `expires=${date.toUTCString()}`;
      document.cookie = `${name}=${value}; ${expires}; path=/`;
    }
  }
});
