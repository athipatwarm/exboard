import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';  // Import your Pinia store
import HomePage from '../views/HomePage.vue';
import TopicPage from '../views/TopicPage.vue';
import TopicDetailPage from '../views/TopicDetailPage.vue';  
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import ProfilePage from '../views/ProfilePage.vue';

// Define the routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/topics',
    name: 'Topics',
    component: TopicPage,
  },
  {
    path: '/topic/:topicName', // Dynamic route for topic detail page
    name: 'TopicDetail',
    component: TopicDetailPage,
    props: true, // Allows passing params as props to the component
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresUnauth: true },  // Prevents access if already logged in
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { requiresUnauth: true },  // Prevents access if already logged in
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true }, // Requires authentication to access this page
  },
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Global navigation guard for authentication
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();  // Access the Pinia auth store

  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.isAuthenticated) {  // Check if the user is authenticated via the store
      next('/login'); // Redirect to login if not authenticated
    } else {
      next(); // Proceed if authenticated
    }
  }
  // Handle unauthenticated routes (Login/Register)
  else if (to.matched.some(record => record.meta.requiresUnauth)) {
    if (auth.isAuthenticated) {
      next('/profile'); // Redirect to profile if already authenticated
    } else {
      next(); // Proceed if not authenticated
    }
  } else {
    next(); // Always allow navigation for routes that don't require auth
  }
});

export default router;
