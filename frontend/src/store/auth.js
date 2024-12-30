import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    isAdmin: false, // Track admin status
    user: null, // Store user information
  }),

  actions: {
    async checkAuth() {
      const token = this.getCookie('token');
      if (token) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.isAuthenticated = true;
          this.user = response.data;
          this.isAdmin = response.data.role === 'admin';
        } catch (error) {
          console.error('Authentication check failed:', error);
          this.logout(); // Clear session on failure
        }
      } else {
        this.logout(); // Ensure cleanup if no token
      }
    },

    async login(email, password) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password });
        const token = response.data.token;

        localStorage.setItem('token', token);
        this.setCookie('token', token);

        this.isAuthenticated = true;
        this.user = response.data.user; // Assuming user info is returned
        this.isAdmin = response.data.user.role === 'admin';
      } catch (error) {
        console.error('Login failed:', error);
        throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
      }
    },

    async logout() {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {}, {
          headers: { Authorization: `Bearer ${this.getCookie('token')}` },
        });
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        localStorage.removeItem('token');
        this.deleteCookie('token');
        this.isAuthenticated = false;
        this.isAdmin = false;
        this.user = null;
      }
    },

    getCookie(name) {
      const cookieString = document.cookie.split('; ').find(row => row.startsWith(`${name}=`));
      return cookieString ? cookieString.split('=')[1] : null;
    },

    setCookie(name, value, days = 7) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; Secure; SameSite=Strict`;
    },

    deleteCookie(name) {
      document.cookie = `${name}=; Max-Age=0; path=/; Secure; SameSite=Strict`;
    },
  },
});
