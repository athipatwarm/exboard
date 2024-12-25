import { createRouter, createWebHistory } from 'vue-router';
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
    path: '/topic',
    name: 'Topic',
    component: TopicPage,
  },
  {
    path: '/topic/:topicName', // Dynamic route for topic detail page
    name: 'TopicDetail',
    component: TopicDetailPage,  // Component for showing the topic detail
    props: true, // Allows passing params as props to the component
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresUnauth: true },  // Added meta to prevent access if already logged in
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { requiresUnauth: true },  // Added meta to prevent access if already logged in
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

  // Handle authenticated routes
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login'); // Redirect to login page if not authenticated
    } else {
      next(); // Proceed if authenticated
    }
  }
  // Handle unauthenticated routes (Login/Register)
  else if (to.matched.some(record => record.meta.requiresUnauth)) {
    if (isAuthenticated) {
      next('/profile'); // Redirect to profile if already authenticated
    } else {
      next(); // Proceed if not authenticated
    }
  } else {
    next(); // Always allow navigation for routes that don't require auth
  }
});

export default router;
