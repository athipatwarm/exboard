<template>
  <div class="topic-detail">
    <h1>{{ topic.title }}</h1>
    <div v-if="topic.category" class="topic-category">Category: {{ topic.category.name }}</div>
    <p>{{ topic.description }}</p>
    <div class="created-at">Created at: {{ new Date(topic.createdAt).toLocaleString() }}</div>
    
    <div v-if="topic.author" class="topic-author">Author: {{ topic.author.name }}</div>
    <div v-if="topic.moderators.length" class="topic-moderators">
      Moderators: 
      <ul>
        <li v-for="moderator in topic.moderators" :key="moderator._id">{{ moderator.name }}</li>
      </ul>
    </div>

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
  const topicTitle = decodeURIComponent(route.params.topicTitle); 
  if (!topicTitle) {
    message.value = { type: 'error', text: 'Topic title is missing in the URL.' };
    return;
  }

  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/topics/${topicTitle}`, {
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
  fetchTopicDetails(); 
});
</script>

<style scoped>
.topic-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 2em;
  margin-bottom: 10px;
}

.topic-category {
  font-style: italic;
  margin-top: 10px;
}

.topic-author {
  font-weight: bold;
  margin-top: 20px;
}

.topic-moderators {
  margin-top: 20px;
}

.created-at {
  color: #777;
  margin-top: 10px;
}

.loading {
  font-size: 1.5em;
  text-align: center;
  color: #777;
}

.message {
  margin-top: 20px;
  padding: 10px;
  text-align: center;
}

.message.success {
  background-color: #4caf50;
  color: white;
}

.message.error {
  background-color: #f44336;
  color: white;
}
</style>
