<template>
  <div class="profile-container">
    <h1>Profile Page</h1>

    <!-- Display user data -->
    <div class="profile-info">
      <p><strong>Username:</strong> {{ user.username }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
    </div>

    <!-- Button to toggle profile edit form visibility -->
    <button @click="toggleEditProfile" class="edit-button">Edit Profile</button>

    <!-- Edit Profile Form -->
    <div v-if="isEditing" class="profile-edit-form">
      <!-- Edit Username -->
      <div class="input-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          v-model="formData.username"
          placeholder="Enter new username"
        />
      </div>

      <!-- Edit Email -->
      <div class="input-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          placeholder="Enter new email"
        />
      </div>

      <!-- Edit Password -->
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
        <label for="newPassword">New Password (Leave blank to keep current)</label>
        <input
          type="password"
          id="newPassword"
          v-model="formData.newPassword"
          placeholder="Enter new password"
        />
      </div>

      <!-- Update Button -->
      <button @click="updateProfile" class="submit-button">Update Profile</button>

      <!-- Error or Success message -->
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../store/auth"; // assuming you have a store for authentication

export default {
  name: "ProfilePage",
  setup() {
    const authStore = useAuthStore();
    const user = ref({
      username: "",
      email: "",
    });
    const formData = ref({
      username: "",
      email: "",
      password: "",
      newPassword: "",
    });
    const errorMessage = ref("");
    const successMessage = ref("");
    const isEditing = ref(false);

    // Fetch the user data on page load
    onMounted(async () => {
      try {
        const response = await fetch("/api/users/me", {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        const data = await response.json();
        if (data) {
          user.value = data;
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    });

    const updateProfile = async () => {
    errorMessage.value = "";
    successMessage.value = "";

    const updatedData = { ...formData.value };
    // If password is empty, don't include it in the update request
    if (!updatedData.newPassword) delete updatedData.newPassword;

    try {
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();

      if (!response.ok) {
        errorMessage.value = data.error || "Something went wrong.";
    }  else {
        successMessage.value = "Profile updated successfully!";
        // Update local data after success
        user.value = { ...data };
        formData.value.username = data.username;
        formData.value.email = data.email;
        formData.value.password = "";
        formData.value.newPassword = "";
      }
    } catch (error) {
      errorMessage.value = "Error updating profile";
      console.error(error);
    }
  };


    // Toggle edit form visibility
    const toggleEditProfile = () => {
      isEditing.value = !isEditing.value;
    };

    return {
      user,
      formData,
      errorMessage,
      successMessage,
      isEditing,
      updateProfile,
      toggleEditProfile,
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
  margin: 20px 0;
  padding: 10px 15px;
  font-size: 1rem;
  border: 2px solid #f3a847;
  color: #f3a847;
  background-color: transparent;
  border-radius: 5px;
  cursor: pointer;
}

.edit-button:hover {
  background-color: #f3a847;
  color: white;
}

.profile-edit-form {
  display: flex;
  flex-direction: column;
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
</style>
