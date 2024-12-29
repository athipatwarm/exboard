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

    // Track which section is being edited
    const isEditingUsername = ref(false);
    const isEditingEmail = ref(false);
    const isEditingPassword = ref(false);

    // Fetch the user data on page load
    onMounted(async () => {
      try {
        const response = await fetch("/api/users/me", {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch user data");
        }
        user.value = data;
      } catch (error) {
        errorMessage.value = error.message || "Failed to fetch user data";
        console.error("Error fetching user data", error);
      }
    });

    // Methods to update profile sections
    const updateUsername = async () => {
      errorMessage.value = "";
      successMessage.value = "";

      try {
        const response = await fetch("/api/users/me", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: formData.value.username }),
          credentials: "include", // Include cookies in the request
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Something went wrong.");
        }

        successMessage.value = "Username updated successfully!";
        user.value.username = data.username;
        formData.value.username = "";
      } catch (error) {
        errorMessage.value = error.message || "Error updating username";
        console.error(error);
      }
    };

    const updateEmail = async () => {
      errorMessage.value = "";
      successMessage.value = "";

      try {
        const response = await fetch("/api/users/me", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.value.email }),
          credentials: "include", // Include cookies in the request
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Something went wrong.");
        }

        successMessage.value = "Email updated successfully!";
        user.value.email = data.email;
        formData.value.email = "";
      } catch (error) {
        errorMessage.value = error.message || "Error updating email";
        console.error(error);
      }
    };

    const updatePassword = async () => {
      errorMessage.value = "";
      successMessage.value = "";

      try {
        const response = await fetch("/api/users/me", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: formData.value.password,
            newPassword: formData.value.newPassword,
          }),
          credentials: "include", // Include cookies in the request
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Something went wrong.");
        }

        successMessage.value = "Password updated successfully!";
        formData.value.password = "";
        formData.value.newPassword = "";
      } catch (error) {
        errorMessage.value = error.message || "Error updating password";
        console.error(error);
      }
    };

    // Toggle edit form visibility for username, email, and password
    const toggleEditUsername = () => {
      isEditingUsername.value = !isEditingUsername.value;
    };
    const toggleEditEmail = () => {
      isEditingEmail.value = !isEditingEmail.value;
    };
    const toggleEditPassword = () => {
      isEditingPassword.value = !isEditingPassword.value;
    };

    return {
      user,
      formData,
      errorMessage,
      successMessage,
      isEditingUsername,
      isEditingEmail,
      isEditingPassword,
      updateUsername,
      updateEmail,
      updatePassword,
      toggleEditUsername,
      toggleEditEmail,
      toggleEditPassword,
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

</style>
