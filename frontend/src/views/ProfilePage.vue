<template>
  <div class="profile-container">
    <h1>Profile Page</h1>

    <div v-if="loading" class="loading-message">
      Loading<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
    </div>

    <div v-else>
      <div class="profile-info">
        <p><strong>Username:</strong> {{ user.username }}</p>
        <button @click="toggleEdit('username')" class="edit-button">
          {{ isEditing.username ? 'Cancel' : 'Edit Username' }}
        </button>
        <div :id="'username-edit-form'" :class="{ 'visible': isEditing.username }" class="profile-edit-form">
          <div class="input-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              v-model="formData.username"
              placeholder="Enter new username"
            />
          </div>
          <button @click="updateField('username', formData.username)" class="submit-button">Update Username</button>
        </div>

        <p><strong>Email:</strong> {{ user.email }}</p>
        <button @click="toggleEdit('email')" class="edit-button">
          {{ isEditing.email ? 'Cancel' : 'Edit Email' }}
        </button>
        <div :id="'email-edit-form'" :class="{ 'visible': isEditing.email }" class="profile-edit-form">
          <div class="input-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              placeholder="Enter new email"
            />
          </div>
          <button @click="updateField('email', formData.email)" class="submit-button">Update Email</button>
        </div>

        <button @click="toggleEdit('password')" class="edit-button">
          {{ isEditing.password ? 'Cancel' : 'Change Password' }}
        </button>
        <div :id="'password-edit-form'" :class="{ 'visible': isEditing.password }" class="profile-edit-form">
          <div class="input-group">
            <label for="password">Current Password</label>
            <input
              type="password"
              id="password"
              v-model="formData.password"
              placeholder="Enter current password"
            />
          </div>
          <div class="input-group">
            <label for="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              v-model="formData.newPassword"
              placeholder="Enter new password"
            />
          </div>
          <button @click="updateField('password', formData.newPassword)" class="submit-button">Update Password</button>
        </div>

        <button v-if="!isEditing.username && !isEditing.email && !isEditing.password" @click="confirmDelete" class="delete-button">
          Delete User
        </button>
      </div>

      <!-- Delete confirmation modal -->
      <div v-if="showDeleteModal" class="delete-modal">
        <div class="modal-content">
          <p>Are you sure you want to delete your account?</p>
          <button @click="deleteUser" class="confirm-button">Yes, Delete</button>
          <button @click="cancelDelete" class="cancel-button">Cancel</button>
        </div>
      </div>

      <!-- Error or Success message -->
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../store/auth'; 
import { useRouter } from 'vue-router';

export default {
  name: 'ProfilePage',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const user = ref({ username: '', email: '' });
    const formData = ref({ username: '', email: '', password: '', newPassword: '' });
    const errorMessage = ref('');
    const successMessage = ref('');
    const loading = ref(true); 
    const showDeleteModal = ref(false);

    const isEditing = ref({
      username: false,
      email: false,
      password: false,
    });

    onMounted(async () => {
      try {
        const response = await fetch('/api/users/me', { method: 'GET', credentials: 'include' });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch user data');
        }
        user.value = data;
      } catch (error) {
        errorMessage.value = error.message || 'Failed to fetch user data';
        console.error('Error fetching user data', error);
      } finally {
        loading.value = false;
      }
    });

    const updateField = async (field, value) => {
      errorMessage.value = '';
      successMessage.value = '';

      if (field === 'password') {
        const { password, newPassword } = formData.value;

        if (!password || !newPassword) {
          errorMessage.value = 'Both current and new passwords are required.';
          return;
        }

        if (password === newPassword) {
          errorMessage.value = 'New password cannot be the same as the current password.';
          return;
        }

        try {
          const response = await fetch('/api/users/me', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password, newPassword }),
            credentials: 'include',
          });
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Something went wrong.');
          }

          successMessage.value = 'Password updated successfully!';
          formData.value.password = '';
          formData.value.newPassword = '';
          isEditing.value.password = false;
        } catch (error) {
          errorMessage.value = error.message || 'Error updating password';
          console.error(error);
        }
        return; 
      }

      if (!value) {
        errorMessage.value = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
        return;
      }

      const currentValue = user.value[field];
      if (value === currentValue) {
        errorMessage.value = `New ${field} cannot be the same as the current ${field}.`;
        return;
      }

      if (field === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errorMessage.value = 'Invalid email format. Please enter a valid email address.';
          return;
        }
      }

      try {
        const response = await fetch('/api/users/me', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [field]: value }),
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Something went wrong.');
        }

        successMessage.value = `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`;
        user.value[field] = data[field];
        formData.value[field] = '';
        isEditing.value[field] = false;
      } catch (error) {
        errorMessage.value = error.message || `Error updating ${field}`;
        console.error(error);
      }
    };

    const toggleEdit = (field) => {
      isEditing.value[field] = !isEditing.value[field];
      if (isEditing.value[field]) {
        formData.value[field] = user.value[field];
      }
    };

    const confirmDelete = () => {
      showDeleteModal.value = true;
    };

    const cancelDelete = () => {
      showDeleteModal.value = false;
    };

    const deleteUser = async () => {
      try {
        const response = await fetch('/api/users/me', {
          method: 'DELETE',
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to delete account');
        }

        successMessage.value = 'Your account has been deleted successfully.';
        authStore.logout();
        router.push('/login');
      } catch (error) {
        errorMessage.value = error.message || 'Error deleting account';
        console.error(error);
      } finally {
        showDeleteModal.value = false;
      }
    };

    return {
      user,
      formData,
      successMessage,
      errorMessage,
      loading,
      isEditing,
      showDeleteModal,
      confirmDelete,
      cancelDelete,
      deleteUser,
      toggleEdit,
      updateField,
    };
  },
};
</script>


<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
}

.profile-info {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.profile-info p {
  font-size: 1rem;
  margin: 10px 0;
}

.edit-button {
  margin-top: 10px;
  padding: 8px 15px;
  font-size: 1rem;
  border: 2px solid #f3a847;
  color: #f3a847;
  background-color: transparent;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  width: 100%;
}

.edit-button:hover {
  background-color: #f3a847;
  color: white;
}

.profile-edit-form {
  display: none;
  transition: opacity 0.3s ease-in-out;
  opacity: 0;
}

.profile-edit-form.visible {
  display: block;
  opacity: 1;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.input-group input {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

.submit-button {
  padding: 12px;
  font-size: 1.1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #45a049;
}

.error-message {
  color: red;
  margin-top: 20px;
}

.success-message {
  color: green;
  margin-top: 20px;
}

.loading-message {
  text-align: center;
  font-size: 1.2rem;
  color: #f3a847;
  font-weight: bold;
}

.dot {
  animation: dot-blink 1.5s infinite steps(1);
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.1s;
}

.dot:nth-child(3) {
  animation-delay: 0.2s;
}

.dot:nth-child(4) {
  animation-delay: 0.3s;
}

@keyframes dot-blink {
  50% {
    opacity: 0;
  }
}


.delete-button {
  margin-top: 20px;
  padding: 8px 15px;
  font-size: 1rem;
  border: 2px solid red;
  color: red;
  background-color: transparent;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  width: 100%;
}

.delete-button:hover {
  background-color: red;
  color: white;
}

.delete-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.confirm-button {
  padding: 10px 20px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button {
  padding: 10px 20px;
  background-color: #ccc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>

