<template>
  <div v-if="topic">
    <h1>{{ topic.name }}</h1>
    <p>{{ topic.description }}</p>
    <!-- Add more topic details here -->
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Get the topic name from the route parameters
const props = defineProps({
  topicName: String,
});

const topic = ref(null);

// Fetch the topic details from the API using the topicName
const fetchTopic = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/topics/${props.topicName}`);
    topic.value = response.data;
  } catch (error) {
    console.error('Error fetching topic:', error);
  }
};

onMounted(() => {
  fetchTopic();
});
</script>
