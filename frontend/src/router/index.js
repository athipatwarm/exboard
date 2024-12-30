import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';  // Import your Pinia store
import HomePage from '../views/HomePage.vue';
import TopicPage from '../views/TopicPage.vue';
import TopicDetailPage from '../views/TopicDetailPage.vue';  
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
    path: '/topics',
    name: 'Topics',
    component: TopicPage,
  },
  {
    path: '/topic/:topicName',
    name: 'TopicDetail',
    component: TopicDetailPage,
    props: true,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresUnauth: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { requiresUnauth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Global navigation guard for authentication check
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();  // Access the Pinia auth store

  // Log authentication status
  console.log('Before Each Route Navigation - Auth Status:', auth.isAuthenticated);

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      next('/login'); // Redirect to login if not authenticated
    } else {
      next(); // Proceed if authenticated
    }
  } else if (to.matched.some(record => record.meta.requiresUnauth)) {
    if (auth.isAuthenticated) {
      console.log('Already authenticated, redirecting to profile');
      next('/profile'); // Redirect to profile if already authenticated
    } else {
      next(); // Proceed if not authenticated
    }
  } else {
    next(); // Always allow navigation for routes that don't require auth
  }
});

export default router;
