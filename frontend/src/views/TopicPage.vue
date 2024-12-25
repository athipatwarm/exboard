<template>
  <div>
    <h1>Topic Page</h1>
    
    <!-- Show create topic button only for admins -->
    <button v-if="isAuthenticated && isAdmin" @click="createTopic">Create Topic</button>
    
    <!-- Show all topics to all authenticated users -->
    <ul>
      <!-- Loop through topics and display them -->
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

// Function to fetch all topics
const fetchTopics = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/topics`);
    topics.value = response.data;
  } catch (error) {
    console.error('Error fetching topics:', error);
  }
};

// Check if the user is authenticated and if they are an admin
const checkAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    isAuthenticated.value = true;
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    isAdmin.value = decodedToken.role === 'admin'; // Check if the user is an admin
  }
};

// Function to create a topic
const createTopic = async () => {
  const topicData = {
    name: 'New Topic Name', // This can be dynamically collected from a form
    description: 'Description of the new topic',
    category: 'category_id_here', // Replace with the actual category ID
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
    fetchTopics(); // Refresh the topics list
  } catch (error) {
    console.error('Error creating topic:', error);
  }
};

// On component mount, check authentication and fetch topics
onMounted(() => {
  fetchTopics();
  checkAuth();
});
</script>
