import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';
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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    await authStore.checkAuth();
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      console.log('User not authenticated, redirecting to login page.');
      return next('/login');
    }
  }

  if (to.matched.some(record => record.meta.requiresUnauth)) {
    if (authStore.isAuthenticated) {
      console.log('User already authenticated, redirecting to profile page.');
      return next('/profile');
    }
  }

  next();
});

export default router;
