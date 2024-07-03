<template>
  <div>
    <h2>Register Organization</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label for="organizationName">Organization Name:</label>
        <input
          type="text"
          v-model="form.ORGANIZATION_NAME"
          id="organizationName"
          required
        />
      </div>
      <!-- <div>
        <label for="organizationEmail">Organization Email:</label>
        <input
          type="email"
          v-model="form.ORGANIZATION_EMAIL"
          id="organizationEmail"
          required
        />
      </div> -->
      <div>
        <label for="organizationPhone">Organization Phone:</label>
        <input
          type="text"
          v-model="form.ORGANIZATION_PHONE"
          id="organizationPhone"
          required
        />
      </div>
      <button type="button" @click="registerOrganization">Register</button>
    </form>
    <div class="modal" v-if="error">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <p>{{ error }}</p>
        <button @click="closeModal">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axiosClient from "../../api/axiosClient";

export default {
  data() {
    return {
      form: {
        ORGANIZATION_NAME: "",
        //ORGANIZATION_EMAIL: "",
        ORGANIZATION_PHONE: "",
      },
      error: null,
    };
  },
  methods: {
    async submitForm() {
      await this.registerOrganization();
    },

    async registerOrganization() {
      try {
        const response = await axiosClient.post(
          "/organization/registerOrganization",
          this.form
        );
        if (response && response.data && response.data.success) {
          Swal.fire({
            title: "Đăng ký thành công!",
            text: "Tổ chức đã được đăng ký thành công.",
            icon: "success",
            confirmButtonText: "Trở về đăng nhập",
          }).then(() => {
            this.$router.push("/login");
          });
          this.resetForm();
        } else if (response && response.data && response.data.message) {
          this.error = response.data.message;
        } else {
          this.error = "Unknown error occurred";
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          this.error = error.response.data.message;
        } else {
          this.error = "Network error occurred";
        }
        console.error(error);
      }
    },

    closeModal() {
      this.error = null;
    },

    resetForm() {
      this.form = {
        ORGANIZATION_NAME: "",
        // ORGANIZATION_EMAIL: "",
        ORGANIZATION_PHONE: "",
      };
    },
  },
};
</script>

<style scoped>
form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

label {
  font-weight: bold;
  margin-bottom: 8px;
  display: block;
}

input[type="text"],
input[type="email"] {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.error-message {
  background-color: #f44336;
  color: white;
  padding: 10px;
  margin-top: 10px;
  border-radius: 4px;
  text-align: center;
}

h2 {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid #2e3a59;
  padding-bottom: 5px;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 400px;
  border-radius: 5px;
  position: relative;
}

.close {
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 28px;
  cursor: pointer;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  float: right;
  margin-top: 10px;
}

button:hover {
  background-color: #45a049;
}
</style>
