<template>
  <div>
    <h1>Topic Page</h1>

    <!-- Button to show Create Topic Form for Admin users -->
    <button v-if="isAuthenticated && isAdmin" @click="toggleCreateForm">
      Create Topic
    </button>

    <!-- Form to create a new topic -->
    <div v-if="showCreateForm">
      <form @submit.prevent="createTopic">
        <label for="title">Title:</label>
        <input type="text" v-model="newTopic.title" required placeholder="Enter topic title" />

        <label for="description">Description:</label>
        <textarea v-model="newTopic.description" required placeholder="Enter topic description"></textarea>

        <label for="category">Category:</label>
        <input type="text" v-model="newTopic.category" required placeholder="Enter category ID" />

        <!-- Confirm and Cancel buttons -->
        <button type="submit" :disabled="isLoading">Confirm Create Topic</button>
        <button type="button" @click="cancelCreateForm">Cancel</button>
      </form>
    </div>

    <!-- Show list of topics -->
    <ul>
      <li v-for="topic in topics" :key="topic._id">
        <router-link :to="`/topic/${topic.name}`">{{ topic.name }}</router-link>
      </li>
    </ul>

    <!-- Loading indicator -->
    <div v-if="isLoading" class="loading">Loading...</div>

    <!-- Success/Error messages -->
    <div v-if="message" :class="message.type">{{ message.text }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// Reactive variables
const topics = ref([]);
const isAuthenticated = ref(false);
const isAdmin = ref(false);
const showCreateForm = ref(false);
const newTopic = ref({
  title: '',
  description: '',
  category: '',
});
const isLoading = ref(false);  // Loading state for the create topic action
const message = ref(null);  // To store success/error messages

// Toggle form visibility
const toggleCreateForm = () => {
  showCreateForm.value = !showCreateForm.value;
};

// Fetch topics from the API
const fetchTopics = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/topics`);
    topics.value = response.data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    message.value = { type: 'error', text: 'Failed to load topics.' };
  } finally {
    isLoading.value = false;
  }
};

// Check authentication and admin status
const checkAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    isAuthenticated.value = true;
    isAdmin.value = decodedToken.role === 'admin';
  }
};

// Create a new topic
const createTopic = async () => {
  if (!newTopic.value.title || !newTopic.value.description || !newTopic.value.category) {
    message.value = { type: 'error', text: 'All fields are required.' };
    return;
  }

  try {
    isLoading.value = true;
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

    message.value = { type: 'success', text: 'Topic created successfully!' };
    fetchTopics();  // Refresh the list of topics
    resetCreateForm();  // Reset the form fields after successful creation
  } catch (error) {
    console.error('Error creating topic:', error);
    message.value = { type: 'error', text: 'Failed to create topic.' };
  } finally {
    isLoading.value = false;
  }
};

// Reset form fields
const resetCreateForm = () => {
  newTopic.value = { title: '', description: '', category: '' };
  showCreateForm.value = false; // Hide form after submission
};

// Cancel the create topic form
const cancelCreateForm = () => {
  resetCreateForm();
};

onMounted(() => {
  fetchTopics();
  checkAuth();
});
</script>

<style scoped>
/* Add basic styling for the page */

button {
  padding: 10px 20px;
  margin: 10px 0;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.loading {
  font-size: 1.5em;
  color: #555;
  text-align: center;
}

ul {
  list-style: none;
}

li {
  margin: 5px 0;
}

.message {
  padding: 10px;
  margin-top: 10px;
}

.success {
  background-color: #4caf50;
  color: white;
}

.error {
  background-color: #f44336;
  color: white;
}
</style>
