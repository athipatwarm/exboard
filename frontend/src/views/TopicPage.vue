<template>
  <div class="topic-page">
    <h1>Topics</h1>

    <!-- Admin-only create topic button -->
    <button v-if="isAuthenticated && isAdmin" @click="toggleCreateForm" class="create-button">
      Create Topic
    </button>

    <!-- Topic creation form -->
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

    <!-- List of topics -->
    <ul v-if="topics.length" class="topic-list">
      <li v-for="topic in topics" :key="topic._id">
        <router-link :to="`/topic/${topic.name}`" class="topic-link">{{ topic.name }}</router-link>
      </li>
    </ul>

    <!-- Loading and message states -->
    <div v-if="isLoading" class="loading">Loading...</div>
    <div v-if="message" :class="['message', message.type]">{{ message.text }}</div>
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
});
const isLoading = ref(false);
const message = ref(null);

const toggleCreateForm = () => {
  showCreateForm.value = !showCreateForm.value;
};

const fetchTopics = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/topics`);
    topics.value = response.data;
  } catch (error) {
    message.value = { type: 'error', text: 'Failed to load topics.' };
  } finally {
    isLoading.value = false;
  }
};

const checkAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    isAuthenticated.value = true;
    isAdmin.value = decodedToken.role === 'admin';
  }
};

const createTopic = async () => {
  if (!newTopic.value.title || !newTopic.value.description) {
    message.value = { type: 'error', text: 'Title and description are required.' };
    return;
  }

  try {
    isLoading.value = true;
    const topicData = {
      title: newTopic.value.title,
      description: newTopic.value.description,
    };

    await axios.post(
      `${import.meta.env.VITE_API_URL}/topics`,
      topicData,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );

    message.value = { type: 'success', text: 'Topic created successfully!' };
    fetchTopics();
    resetCreateForm();
  } catch (error) {
    message.value = { type: 'error', text: 'Failed to create topic.' };
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

onMounted(() => {
  fetchTopics();
  checkAuth();
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
  list-style-type: none;
  padding: 0;
}

.topic-list li {
  margin: 10px 0;
}

.topic-link {
  text-decoration: none;
  color: #007bff;
}

.topic-link:hover {
  text-decoration: underline;
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
