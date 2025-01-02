<template>
  <div class="topic-detail">
    <div class="topic-info">
      <div class="topic-box">
        <h1>{{ topic.title }}</h1>
        <div v-if="topic.category" class="topic-category">Category: {{ topic.category.name }}</div>
        <p>{{ topic.description }}</p>
        <div class="created-at">Created at: {{ new Date(topic.createdAt).toLocaleString() }}</div>
        <div v-if="topic.author" class="topic-author">Author: {{ topic.author.username }}</div>

        <!-- Delete Topic button visible only for admins -->
        <div v-if="isAdmin" class="delete-button-container">
          <button @click="deleteTopic" class="delete-button">Delete Topic</button>
        </div>

        <!-- Create Post button visible only to authenticated users -->
        <div v-if="isAuthenticated" class="create-post-button-container">
          <button @click="togglePostForm" class="create-post-button">Create Post</button>
        </div>
      </div>
    </div>

    <!-- Form to create a new post -->
    <div v-if="showPostForm" class="post-form-container">
      <h3>Create a Post</h3>
      <form @submit.prevent="createPost">
        <label for="postTitle">Title:</label>
        <input type="text" id="postTitle" v-model="newPost.title" required />

        <label for="postContent">Content:</label>
        <textarea id="postContent" v-model="newPost.content" required></textarea>

        <button type="submit" class="submit-button">Submit</button>
      </form>
    </div>

    <div class="posts-section">
      <h2>Posts</h2>
      <div v-if="isLoading" class="loading">Loading posts...</div>
      <div v-if="message" :class="['message', message.type]">{{ message.text }}</div>
      <div v-for="post in topic.posts" :key="post._id" class="post-item">
        <h3>{{ post.title }}</h3>
        <p>{{ post.content }}</p>
        <div class="post-author">Posted by: {{ post.author.username }}</div>
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
const isAuthenticated = ref(false); // Track if the user is authenticated
const showPostForm = ref(false); // Toggle visibility of the post creation form
const newPost = ref({ title: '', content: '' }); // New post data

// Fetch topic details
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
    isAdmin.value = useAuthStore().isAdmin;
    isAuthenticated.value = !!token; // Check if the user is authenticated
  } catch (error) {
    console.error('Error fetching topic details:', error);
    message.value = { type: 'error', text: 'Failed to fetch topic details.' };
  } finally {
    isLoading.value = false;
  }
};

// Delete Topic
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

// Toggle Post Form visibility
const togglePostForm = () => {
  showPostForm.value = !showPostForm.value;
};

// Create a new post
const createPost = async () => {
  const token = localStorage.getItem('token');
  const topicId = topic.value._id;
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts`, {
      title: newPost.value.title,
      content: newPost.value.content,
      topic: topicId,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    message.value = { type: 'success', text: 'Post created successfully!' };
    topic.value.posts.push(response.data); // Update the list of posts
    newPost.value = { title: '', content: '' }; // Reset the form
    showPostForm.value = false; // Hide the form after submission
  } catch (error) {
    message.value = { type: 'error', text: 'Failed to create post.' };
  }
};

onMounted(() => {
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

.create-post-button-container {
  margin-top: 20px;
  text-align: right;
}

.create-post-button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.create-post-button:hover {
  background-color: #45a049;
}

.post-form-container {
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.post-form-container form {
  display: flex;
  flex-direction: column;
}

.post-form-container input,
.post-form-container textarea {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.submit-button {
  padding: 10px 20px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #1976d2;
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
