<template>
  <div class="topic-detail">
    <h1>{{ topic.title }}</h1>
    <div v-if="topic.category" class="topic-category">Category: {{ topic.category.name }}</div>
    <p>{{ topic.description }}</p>
    <div class="created-at">Created at: {{ new Date(topic.createdAt).toLocaleString() }}</div>
    
    <div v-if="isLoading" class="loading">Loading...</div>
    <div v-if="message" :class="['message', message.type]">{{ message.text }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const topic = ref({});
const isLoading = ref(false);
const message = ref(null);

const fetchTopicDetails = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/topics/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    topic.value = response.data;
  } catch (error) {
    console.error('Error fetching topic details:', error);
    message.value = { type: 'error', text: 'Failed to fetch topic details.' };
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchTopicDetails(); // Fetch topic details when the page loads
});
</script>