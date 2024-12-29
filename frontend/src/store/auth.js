import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
  }),
  actions: {
    async checkAuth() {
      const token = this.getCookie('auth_token');
      this.isAuthenticated = !!token;
    },
    async login(email, password) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password });
        document.cookie = `auth_token=${response.data.token}; path=/;`;
        this.isAuthenticated = true;
      } catch (error) {
        throw new Error('Login failed');
      }
    },
    async logout() {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {}, {
          headers: {
            Authorization: `Bearer ${this.getCookie('auth_token')}`,
          },
        });
        document.cookie = 'auth_token=; Max-Age=0; path=/;';
        this.isAuthenticated = false;
      } catch (error) {
        console.error('Logout failed', error);
      }
    },
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    },
  },
});
