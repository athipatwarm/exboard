<template>
  <div class="topic-detail">
    <div class="topic-info">
      <div class="topic-box">
        <h1>{{ topic.title }}</h1>
        <div v-if="topic.category" class="topic-category">Category: {{ topic.category.name }}</div>
        <p>{{ topic.description }}</p>
        <div class="created-at">Created at: {{ new Date(topic.createdAt).toLocaleString() }}</div>

        <div v-if="topic.author" class="topic-author">Author: {{ topic.author.username }}</div>

        <div v-if="isAdmin" class="delete-button-container">
          <button @click="deleteTopic" class="delete-button">Delete Topic</button>
        </div>
      </div>
    </div>

    <div class="posts-section">
      <h2>Posts</h2>
      <div v-if="isLoading" class="loading">Loading posts...</div>
      <div v-if="message" :class="['message', message.type]">{{ message.text }}</div>
      <div v-for="post in topic.posts" :key="post._id" class="post-item">
        <h3>{{ post.title }}</h3>
        <p>{{ post.content }}</p>
        <div class="post-author">
          Posted by: {{ post.author.username }}
        </div>
        <div class="post-date">
          Created at: {{ new Date(post.createdAt).toLocaleString() }}
        </div>
      </div>

      <div v-if="authStore.isAuthenticated" class="post-button-container">
        <button @click="addPost" class="post-button">Create Post</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '../store/auth';

const route = useRoute(); 
const router = useRouter(); 
const topic = ref({});
const isLoading = ref(false);
const message = ref(null);
const isAdmin = ref(false); 

const authStore = useAuthStore();

const fetchTopicDetails = async () => {
  const topicName = decodeURIComponent(route.params.topicName); 
  if (!topicName) {
    message.value = { type: 'error', text: 'Topic title is missing in the URL.' };
    return;
  }

  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/topics/${topicName}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    topic.value = response.data;
    isAdmin.value = authStore.isAdmin;
    
    if (topic.value && topic.value.posts) {
      topic.value.posts = response.data.posts;
    } else {
      message.value = { type: 'error', text: 'No posts found for this topic.' };
    }
  } catch (error) {
    console.error('Error fetching topic details:', error);
    message.value = { type: 'error', text: 'Failed to fetch topic details.' };
  } finally {
    isLoading.value = false;
  }
};


const deleteTopic = async () => {
  const topicId = topic.value._id;
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    await axios.delete(`${import.meta.env.VITE_API_URL}/topics/${topicId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    message.value = { type: 'success', text: 'Topic deleted successfully!' };
    router.push('/topics'); 
  } catch (error) {
    message.value = { type: 'error', text: 'Failed to delete topic.' };
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  authStore.checkAuth(); 
  fetchTopicDetails(); 
});
</script>

<style scoped>
.topic-detail {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.topic-info {
  width: 25%;
  padding-right: 20px;
}

.posts-section {
  width: 70%;
}

.topic-box {
  border: 2px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
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

.created-at {
  color: #777;
  margin-top: 10px;
}

.delete-button-container {
  margin-top: 20px;
  text-align: right;
}

.delete-button {
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #d32f2f;
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

.post-item {
  margin-top: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 15px;
}

.post-item h3 {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.post-author {
  font-size: 0.9em;
  color: #555;
  margin-top: 10px;
}

</style>
