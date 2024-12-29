<script setup>
import Header from './components/Header.vue'; 
import { useAuthStore } from './store/auth'; 

const auth = useAuthStore(); 
console.log('Auth Status in App:', auth.isAuthenticated);
</script>

<template>
  <div>
    <!-- Global Header Component -->
    <Header />  

    <!-- Router View displays the route content -->
    <router-view /> 
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
