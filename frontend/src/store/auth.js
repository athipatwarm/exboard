import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,  // Default authentication state
    isAdmin: false,  // Default role state
    token: null,  // Store token to sync with cookie/localStorage
  }),

  actions: {
    // Check if user is authenticated based on token
    checkAuth() {
      const storedToken = localStorage.getItem('token') || this.getCookie('token');
      if (storedToken) {
        this.token = storedToken;
        this.isAuthenticated = true;
        const decodedToken = this.decodeToken(storedToken);
        this.isAdmin = decodedToken.role === 'admin';
      } else {
        this.isAuthenticated = false;
        this.isAdmin = false;
      }
    },

    // Decode the token
    decodeToken(token) {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decoded;
    },

    // Log in the user and store the authentication token
    async login(email, password) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password });
        const token = response.data.token;

        // Store the token in localStorage and set it as a cookie
        localStorage.setItem('token', token);
        this.setCookie('token', token);

        this.token = token;
        this.isAuthenticated = true;
        const decodedToken = this.decodeToken(token);
        this.isAdmin = decodedToken.role === 'admin';
      } catch (error) {
        console.error('Login failed:', error);
        throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
      }
    },

    // Log out the user and clear the authentication state
    async logout() {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {}, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        // Clear token from localStorage and cookies
        localStorage.removeItem('token');
        this.deleteCookie('token');
        this.isAuthenticated = false;
        this.isAdmin = false;
      } catch (error) {
        console.error('Logout failed:', error);
        // Fallback: Clear token even if the API call fails
        localStorage.removeItem('token');
        this.deleteCookie('token');
        this.isAuthenticated = false;
        this.isAdmin = false;
      }
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
