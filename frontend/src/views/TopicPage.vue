<template>
  <div>
    <h1>Topic Page</h1>
    <button v-if="isAuthenticated && isAdmin" @click="createTopic">Create Topic</button>
    <ul>
      <!-- Loop through topics -->
      <li v-for="topic in topics" :key="topic._id">
        <router-link :to="`/topic/${topic.name}`">{{ topic.name }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const topics = ref([]);
const isAuthenticated = ref(false);
const isAdmin = ref(false);

const fetchTopics = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/topics`);
    topics.value = response.data;
  } catch (error) {
    console.error('Error fetching topics:', error);
  }
};

const checkAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    isAuthenticated.value = true;
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    isAdmin.value = decodedToken.role === 'admin';  // Check if the user is an admin
  }
};

const createTopic = async () => {
  const topicData = {
    name: 'New Topic Name',  // You can gather the topic details from a form
    description: 'Description of the new topic',
    // Add any other necessary data
  };

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/topics`,
      topicData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    console.log('Topic created successfully:', response.data);
    // Redirect or update UI after creating the topic
  } catch (error) {
    console.error('Error creating topic:', error);
  }
};

onMounted(() => {
  fetchTopics();
  checkAuth();
});
</script>
