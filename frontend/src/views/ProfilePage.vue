<template>
  <div class="profile-container">
    <h1>Profile Page</h1>

    <div v-if="loading" class="loading-message">Loading...</div>
    <div v-else>
      <div class="profile-info">
        <p><strong>Username:</strong> {{ user.username }}</p>
        <button v-if="!isEditingUsername" @click="toggleEditUsername" class="edit-button">Edit Username</button>

        <p><strong>Email:</strong> {{ user.email }}</p>
        <button v-if="!isEditingEmail" @click="toggleEditEmail" class="edit-button">Edit Email</button>

        <button v-if="!isEditingPassword" @click="toggleEditPassword" class="edit-button">Change Password</button>

        <button v-if="!isEditingUsername && !isEditingEmail && !isEditingPassword" @click="confirmDelete" class="delete-button">Delete User</button>
      </div>

      <!-- Edit Username Form -->
      <div v-if="isEditingUsername" class="profile-edit-form">
        <div class="input-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="formData.username" placeholder="Enter new username" />
        </div>
        <button @click="updateUsername" class="submit-button">Update Username</button>
        <button @click="cancelEdit('username')" class="cancel-button">Cancel</button>
      </div>

      <!-- Edit Email Form -->
      <div v-if="isEditingEmail" class="profile-edit-form">
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="formData.email" placeholder="Enter new email" />
        </div>
        <button @click="updateEmail" class="submit-button">Update Email</button>
        <button @click="cancelEdit('email')" class="cancel-button">Cancel</button>
      </div>

      <!-- Edit Password Form -->
      <div v-if="isEditingPassword" class="profile-edit-form">
        <div class="input-group">
          <label for="password">Current Password</label>
          <input type="password" id="password" v-model="formData.password" placeholder="Enter current password" />
        </div>

        <div class="input-group">
          <label for="newPassword">New Password</label>
          <input type="password" id="newPassword" v-model="formData.newPassword" placeholder="Enter new password" />
        </div>

        <button @click="updatePassword" class="submit-button">Update Password</button>
        <button @click="cancelEdit('password')" class="cancel-button">Cancel</button>
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

    const isEditingUsername = ref(false);
    const isEditingEmail = ref(false);
    const isEditingPassword = ref(false);

    if (!authStore.isAuthenticated) {
      router.push('/login'); 
    }

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

    const updateUsername = async () => {
      errorMessage.value = '';
      successMessage.value = '';

      if (!formData.value.username) {
        errorMessage.value = 'Username is required.';
        return;
      }

      try {
        const response = await fetch('/api/users/me', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: formData.value.username }),
          credentials: 'include',
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Something went wrong.');
        }

        successMessage.value = 'Username updated successfully!';
        user.value.username = data.username;
        formData.value.username = '';
        isEditingUsername.value = false;
      } catch (error) {
        errorMessage.value = error.message || 'Error updating username';
        console.error(error);
      }
    };

    const updateEmail = async () => {
      errorMessage.value = '';
      successMessage.value = '';

      if (!formData.value.email) {
        errorMessage.value = 'Email is required.';
        return;
      }

      try {
        const response = await fetch('/api/users/me', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.value.email }),
          credentials: 'include',
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Something went wrong.');
        }

        successMessage.value = 'Email updated successfully!';
        user.value.email = data.email;
        formData.value.email = '';
        isEditingEmail.value = false;
      } catch (error) {
        errorMessage.value = error.message || 'Error updating email';
        console.error(error);
      }
    };

    const updatePassword = async () => {
      errorMessage.value = '';
      successMessage.value = '';

      if (!formData.value.password || !formData.value.newPassword) {
        errorMessage.value = 'Both current and new passwords are required.';
        return;
      }

      try {
        const response = await fetch('/api/users/me', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            password: formData.value.password,
            newPassword: formData.value.newPassword,
          }),
          credentials: 'include',
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Something went wrong.');
        }

        successMessage.value = 'Password updated successfully!';
        formData.value.password = '';
        formData.value.newPassword = '';
        isEditingPassword.value = false;
      } catch (error) {
        errorMessage.value = error.message || 'Error updating password';
        console.error(error);
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

    const toggleEditUsername = () => {
      isEditingUsername.value = !isEditingUsername.value;
    };

    const toggleEditEmail = () => {
      isEditingEmail.value = !isEditingEmail.value;
    };

    const toggleEditPassword = () => {
      isEditingPassword.value = !isEditingPassword.value;
    };

    const cancelEdit = (field) => {
      if (field === 'username') {
        isEditingUsername.value = false;
      } else if (field === 'email') {
        isEditingEmail.value = false;
      } else if (field === 'password') {
        isEditingPassword.value = false;
      }
      formData.value = { username: '', email: '', password: '', newPassword: '' };
    };

    return {
      user,
      formData,
      successMessage,
      errorMessage,
      loading,
      isEditingUsername,
      isEditingEmail,
      isEditingPassword,
      showDeleteModal,
      confirmDelete,
      cancelDelete,
      deleteUser,
      toggleEditUsername,
      toggleEditEmail,
      toggleEditPassword,
      updateUsername,
      updateEmail,
      updatePassword,
      cancelEdit,
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
  display: flex;
  flex-direction: column;
  margin-top: 20px;
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

.cancel-button {
  margin-top: 10px;
  padding: 8px 15px;
  font-size: 1rem;
  border: 2px solid #ccc;
  color: #333;
  background-color: transparent;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  width: 100%;
}

.cancel-button:hover {
  background-color: #ccc;
  color: white;
}
</style>
