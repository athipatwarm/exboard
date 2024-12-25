import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import TopicPage from '../views/TopicPage.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import ProfilePage from '../views/ProfilePage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/topic',
    name: 'Topic',
    component: TopicPage,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token'); // Check if token exists
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // If route requires authentication and the user is not authenticated
    if (!isAuthenticated) {
      next('/login'); // Redirect to login page
    } else {
      next(); // Allow navigation to the profile page
    }
  } else {
    next(); // Proceed if no authentication is required
  }
});

export default router;
