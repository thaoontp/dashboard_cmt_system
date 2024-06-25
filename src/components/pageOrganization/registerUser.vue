<template>
  <div class="register-form">
    <h2>Register</h2>
    <form @submit.prevent="handleSubmit" class="form">
      <!-- Nhập tên người dùng -->
      <div class="form-group">
        <label for="USERNAME">Username:</label>
        <input type="text" id="USERNAME" v-model="formData.USERNAME" required />
      </div>
      <!-- Nhập mật khẩu -->
      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="PASSWORD"
          v-model="formData.PASSWORD"
          required
        />
      </div>
      <!-- Nhập họ tên đầy đủ -->
      <div class="form-group">
        <label for="fullname">Full Name:</label>
        <input type="text" id="FULLNAME" v-model="formData.FULLNAME" required />
      </div>
      <!-- Nhập email -->
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="formData.EMAIL" required />
      </div>
      <!-- Nhập địa chỉ -->
      <div class="form-group">
        <label for="address">Address:</label>
        <input type="text" id="address" v-model="formData.ADDRESS" />
      </div>
      <!-- Nhập giới tính -->
      <div class="form-group">
        <label for="gender">Gender:</label>
        <input type="text" id="gender" v-model="formData.GENDER" />
      </div>
      <button type="submit">Đăng Ký</button>
    </form>
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script>
import axiosClient from "../../api/axiosClient";

export default {
  data() {
    return {
      formData: {
        USERNAME: "",
        PASSWORD: "",
        FULLNAME: "",
        EMAIL: "",
        ADDRESS: "",
        GENDER: "",
      },
      message: "",
    };
  },
  methods: {
    async handleSubmit() {
      // Kiểm tra các trường bắt buộc trước khi gửi yêu cầu
      if (
        !this.formData.USERNAME ||
        !this.formData.PASSWORD ||
        !this.formData.FULLNAME ||
        !this.formData.EMAIL
      ) {
        this.message = "Vui lòng điền đầy đủ các trường bắt buộc.";
        return;
      }

      const payload = new FormData();
      for (const key in this.formData) {
        payload.append(key.toUpperCase(), this.formData[key]);
      }

      console.log("Payload data:", [...payload.entries()]);

      try {
        const response = await axiosClient.post(
          "/user/register",
          this.formData
        );
        this.message = response.data.message;
      } catch (error) {
        this.message =
          error.response?.data?.message || "Đăng ký người dùng thất bại";
        console.error("Error:", error.response?.data);
      }
    },
  },
};
</script>

<style scoped>
.register-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h2 {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid #4caf50;
  padding-bottom: 5px;
}

.form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
}

input[type="text"],
input[type="password"],
input[type="email"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}

.message {
  margin-top: 10px;
  text-align: center;
  font-weight: bold;
}
</style>
