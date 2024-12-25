<script setup>
import { defineComponent } from 'vue';  // You can import helpers if needed
import Header from './components/Header.vue';  // Import Header component
</script>

<template>
  <div>
    <!-- Your Global Header -->
    <Header />  <!-- Header should appear here -->

    <!-- Router View will display the page content based on the route -->
    <router-view />  <!-- This is where your route content will be injected -->

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
