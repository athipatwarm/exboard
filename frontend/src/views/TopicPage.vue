<template>
  <div class="topic-page">
    <h1>Topics</h1>

    <button v-if="authStore.isAuthenticated && authStore.isAdmin" @click="toggleCreateForm" class="create-button">
      Create Topic
    </button>

    <div v-if="showCreateForm" class="create-form">
      <form @submit.prevent="createTopic">
        <input type="text" v-model="newTopic.title" placeholder="Title" required class="input" />
        <textarea v-model="newTopic.description" placeholder="Description" required class="input"></textarea>
        <div class="form-actions">
          <button type="submit" :disabled="isLoading" class="button submit-button">Create</button>
          <button type="button" @click="cancelCreateForm" class="button cancel-button">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="topics.length" class="topic-list">
      <div v-for="topic in topics" :key="topic._id" class="topic-box">
        <!-- Use title as the link identifier -->
        <router-link :to="`/topic/${topic.title}`" class="topic-link">
          <div class="topic-title">{{ topic.title }}</div>
          <div class="topic-description">{{ topic.description }}</div>
          <div v-if="topic.category" class="topic-category">Category: {{ topic.category.name }}</div>
        </router-link>
      </div>
    </div>
    <div v-else class="empty-list">No topics available. Please create one.</div>

    <div v-if="isLoading" class="loading">Loading...</div>
    <div v-if="message" :class="['message', message.type]">{{ message.text }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../store/auth';

const authStore = useAuthStore();
const topics = ref([]);
const showCreateForm = ref(false);
const newTopic = ref({
  title: '',
  description: '',
});
const isLoading = ref(false);
const message = ref(null);

const toggleCreateForm = () => {
  showCreateForm.value = !showCreateForm.value;
};

const fetchTopics = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token') || authStore.getCookie('token');
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/topics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    topics.value = response.data; // Populate the topics array with fetched data
  } catch (error) {
    console.error('Error fetching topics:', error);
    message.value = { type: 'error', text: 'Failed to fetch topics.' };
  } finally {
    isLoading.value = false;
  }
};

const createTopic = async () => {
  if (!newTopic.value.title || !newTopic.value.description) {
    message.value = { type: 'error', text: 'Title and description are required.' };
    return;
  }

  try {
    isLoading.value = true;
    const token = localStorage.getItem('token') || authStore.getCookie('token');
    const topicData = { title: newTopic.value.title, description: newTopic.value.description };

    await axios.post(`${import.meta.env.VITE_API_URL}/topics`, topicData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    message.value = { type: 'success', text: 'Topic created successfully!' };
    fetchTopics(); // Re-fetch topics after creating one
    resetCreateForm();
  } catch (error) {
    handleError("Failed to create topic.", error);
  } finally {
    isLoading.value = false;
  }
};

const resetCreateForm = () => {
  newTopic.value = { title: '', description: '' };
  showCreateForm.value = false;
};

const cancelCreateForm = () => {
  resetCreateForm();
};

const handleError = (defaultMessage, error) => {
  const errorMessage = error.response?.data?.message || defaultMessage;
  message.value = { type: 'error', text: errorMessage };
};

onMounted(() => {
  authStore.checkAuth(); // Make sure authentication is checked when component is mounted
  fetchTopics(); // Fetch topics when the page loads
});
</script>


<style scoped>
.topic-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.create-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.create-button:hover {
  background-color: #0056b3;
}

.create-form {
  margin-top: 20px;
}

.input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

.button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button {
  background-color: #4caf50;
  color: white;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #f44336;
  color: white;
}

.cancel-button:hover {
  background-color: #d32f2f;
}

.topic-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.topic-box {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease;
}

.topic-box:hover {
  background-color: #e1e1e1;
}

.topic-name {
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
}

.topic-description {
  font-size: 1em;
  color: #777;
  margin-top: 10px;
}

.empty-list {
  text-align: center;
  color: #777;
  font-style: italic;
  margin-top: 20px;
}

.loading {
  text-align: center;
  font-size: 1.5em;
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
