import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    // Check if user is authenticated based on token
    checkAuth() {
      const token = this.getCookie('token');
      if (token) {
        this.isAuthenticated = true; // Token exists in cookies
      } else {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          this.isAuthenticated = true;
          this.setCookie('token', storedToken); // Sync cookie with localStorage
        } else {
          this.isAuthenticated = false; // No token found
        }
      }
    },

    async login(email, password) {
      try {
        const response = await axios.post('/api/login', { email, password });
        this.user = response.data.user;
        this.token = response.data.token;  // Assuming token is sent in response
        localStorage.setItem('token', this.token);  // Optionally store in local storage
      } catch (error) {
        throw new Error('Invalid login credentials');
      }
    },

    async register(username, email, password) {
      try {
        const response = await axios.post('/api/register', { username, email, password });
        return response.data;  // Return success message, etc.
      } catch (error) {
        throw new Error('Registration failed. Please try again.');
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');  // Remove token from localStorage (if applicable)
    },


    // Utility function to get a cookie by name
    getCookie(name) {
      const cookieString = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${name}=`));
      return cookieString ? cookieString.split('=')[1] : null;
    },

    // Utility function to set a cookie
    setCookie(name, value, days = 7) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      const expires = `expires=${date.toUTCString()}`;
      document.cookie = `${name}=${value}; ${expires}; path=/; Secure; SameSite=Strict`;
    },

    // Utility function to delete a cookie
    deleteCookie(name) {
      document.cookie = `${name}=; Max-Age=0; path=/; Secure; SameSite=Strict`;
    },
  },
});
