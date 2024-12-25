<template>
  <div>
    <h1>Topic Page</h1>
    
    <!-- Only show "Create Topic" button if the user is authenticated and an admin -->
    <button v-if="isAuthenticated && isAdmin" @click="showCreateForm = !showCreateForm">
      Create Topic
    </button>

    <!-- Show form to create a new topic -->
    <div v-if="showCreateForm">
      <form @submit.prevent="createTopic">
        <label for="title">Title:</label>
        <input type="text" v-model="newTopic.title" required placeholder="Enter topic title" />

        <label for="description">Description:</label>
        <textarea v-model="newTopic.description" required placeholder="Enter topic description"></textarea>

        <label for="category">Category:</label>
        <input type="text" v-model="newTopic.category" required placeholder="Enter category ID" />

        <!-- Confirm button to submit the form -->
        <button type="submit">Confirm Create Topic</button>
        <button type="button" @click="showCreateForm = false">Cancel</button> <!-- Cancel button to hide form -->
      </form>
    </div>

    <!-- Show all topics to all authenticated users -->
    <ul>
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
const showCreateForm = ref(false);
const newTopic = ref({
  title: '',
  description: '',
  category: '',
});

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
    isAdmin.value = decodedToken.role === 'admin';
  }
};

const createTopic = async () => {
  try {
    const topicData = {
      title: newTopic.value.title,
      description: newTopic.value.description,
      category: newTopic.value.category,
    };

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
    showCreateForm.value = false; // Hide the form after creating the topic
  } catch (error) {
    console.error('Error creating topic:', error);
  }
};

onMounted(() => {
  fetchTopics();
  checkAuth();
});
</script>
