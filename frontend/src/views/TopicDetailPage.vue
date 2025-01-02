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

      <div v-if="topic.posts && topic.posts.length > 0">
        <div v-for="post in topic.posts" :key="post._id" class="post-item">
          <h3>{{ post.title }}</h3>
          <p>{{ post.content }}</p>
          <div class="post-author">
            Posted by: {{ post.author ? post.author.username : 'Unknown Author' }}
          </div>
          <div class="post-date">
            Created at: {{ new Date(post.createdAt).toLocaleString() }}
          </div>
        </div>
      </div>
      <div v-else>
        <p>No posts found for this topic.</p>
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

    if (response && response.data) {
      topic.value = response.data;
    } else {
      throw new Error('No data found for this topic.');
    }

    const postsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${topic.value._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (postsResponse && postsResponse.data) {
      topic.value.posts = postsResponse.data;
    } else {
      message.value = { type: 'error', text: 'No posts found for this topic.' };
    }

    isAdmin.value = authStore.isAdmin;
  } catch (error) {
    console.error(error);
    message.value = { type: 'error', text: error.message || 'Failed to fetch topic details.' };
  } finally {
    isLoading.value = false;
  }
};

// Delete topic
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

// Toggle create post form visibility
const toggleCreatePostForm = () => {
  showCreatePostForm.value = !showCreatePostForm.value;
};

exports.createPost = async (req, res) => {
  if (!req.user) {
    console.log("Backend log: User is not logged in.");
    return res.status(401).send({ error: 'You must be logged in to create a post' });
  }

  const { title, content, topic } = req.body;

  if (!title || !content || !topic) {
    console.log("Backend log: Missing required fields");
    return res.status(400).send({ error: 'Title, content, and topic are required' });
  }

  if (!mongoose.Types.ObjectId.isValid(topic)) {
    console.log("Backend log: Invalid topic ID", topic);
    return res.status(400).send({ error: 'Invalid topic ID' });
  }

  try {
    const topicExists = await Topic.findById(topic);
    if (!topicExists) {
      console.log("Backend log: Topic not found", topic);
      return res.status(404).send({ error: 'Topic not found' });
    }

    const post = new Post({
      title,
      content,
      topic,
      author: req.user._id
    });

    console.log("Backend log: Saving new post", post);

    await post.save();

    topicExists.posts.push(post._id);
    await topicExists.save();

    console.log("Backend log: Post created successfully", post);

    res.status(201).send(post);
  } catch (error) {
    console.error("Backend log: Error creating post", error);
    res.status(500).send({ error: 'Failed to create post' });
  }
};

// Cancel post creation form
const cancelCreatePostForm = () => {
  newPost.value = { title: '', content: '' };
  showCreatePostForm.value = false;
  message.value = null;
};

onMounted(() => {
  authStore.checkAuth();
  isAdmin.value = authStore.isAdmin;
  fetchTopicDetails();
});
</script>

<style scoped>
.topic-detail {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f4f4f9;
}

.topic-info {
  width: 30%;
}

.posts-section {
  width: 65%;
}

.topic-box {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2em;
  margin-bottom: 10px;
}

.topic-category {
  font-style: italic;
  color: #555;
  margin-top: 10px;
}

.created-at, .topic-author {
  font-size: 0.9em;
  color: #777;
}

.delete-button-container {
  text-align: right;
  margin-top: 15px;
}

.delete-button {
  padding: 8px 15px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}

.delete-button:hover {
  background-color: #ff4040;
}

.loading {
  font-size: 1.5em;
  color: #777;
  text-align: center;
}

.message {
  padding: 10px;
  margin-top: 20px;
  text-align: center;
}

.message.success {
  background-color: #4caf50;
  color: white;
}

.message.error {
  color: #777;
  font-style: italic;
}

.post-item {
  margin-top: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ddd;
}

.post-item h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
}

.create-post-form {
  margin-top: 20px;
}

.input {
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button {
  background-color: #4caf50;
  color: white;
}

.submit-button:disabled {
  background-color: #ccc;
}

.cancel-button {
  background-color: #f44336;
  color: white;
}

.cancel-button:hover {
  background-color: #d32f2f;
}

.post-button {
  display: block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.post-button:hover {
  background-color: #0056b3;
}
</style>
