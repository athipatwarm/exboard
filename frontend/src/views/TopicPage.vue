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
        <button @click="toggleCreatePostForm" class="post-button">Create Post</button>
      </div>

      <div v-if="showCreatePostForm" class="create-post-form">
        <form @submit.prevent="createPost">
          <input type="text" v-model="newPost.title" placeholder="Title" required class="input" />
          <textarea v-model="newPost.content" placeholder="Content" required class="input"></textarea>

          <div class="form-actions">
            <button type="submit" :disabled="isLoading" class="button submit-button">Create</button>
            <button type="button" @click="cancelCreatePostForm" class="button cancel-button">Cancel</button>
          </div>
        </form>
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
const showCreatePostForm = ref(false);
const newPost = ref({ title: '', content: '' });

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

const toggleCreatePostForm = () => {
  showCreatePostForm.value = !showCreatePostForm.value;
};

const createPost = async () => {
  if (!newPost.value.title || !newPost.value.content) {
    message.value = { type: 'error', text: 'Title and content are required.' };
    return;
  }

  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    const postData = {
      title: newPost.value.title,
      content: newPost.value.content,
      topicId: topic.value._id,
    };

    await axios.post(`${import.meta.env.VITE_API_URL}/posts`, postData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    message.value = { type: 'success', text: 'Post created successfully!' };
    fetchTopicDetails();
    cancelCreatePostForm();
  } catch (error) {
    message.value = { type: 'error', text: 'Failed to create post.' };
  } finally {
    isLoading.value = false;
  }
};

const cancelCreatePostForm = () => {
  newPost.value = { title: '', content: '' };
  showCreatePostForm.value = false;
};

onMounted(() => {
  authStore.checkAuth();
  fetchTopicDetails();
});
</script>

<style scoped>
.topic-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
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
.create-post-form {
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
</style>
