<template>
  <div class="register-form">
    <h2>Register</h2>
    <form @submit.prevent="handleSubmit" class="form">
      <!-- Nhập tên người dùng -->
      <div class="form-group">
        <label for="USERNAME">Username: <span class="required">*</span></label>
        <input type="text" id="USERNAME" v-model="formData.USERNAME" />
        <p v-if="errors.USERNAME" class="error-message">
          {{ errors.USERNAME }}
        </p>
      </div>
      <!-- Nhập mật khẩu -->
      <div class="form-group">
        <label for="PASSWORD">Password: <span class="required">*</span></label>
        <input type="password" id="PASSWORD" v-model="formData.PASSWORD" />
        <p v-if="errors.PASSWORD" class="error-message">
          {{ errors.PASSWORD }}
        </p>
      </div>
      <!-- Nhập lại mật khẩu -->
      <div class="form-group">
        <label for="CONFIRM_PASSWORD"
          >Confirm Password: <span class="required">*</span></label
        >
        <input
          type="password"
          id="CONFIRM_PASSWORD"
          v-model="confirmPassword"
        />
        <p v-if="errors.CONFIRM_PASSWORD" class="error-message">
          {{ errors.CONFIRM_PASSWORD }}
        </p>
      </div>
      <!-- Nhập họ tên đầy đủ -->
      <div class="form-group">
        <label for="FULLNAME">Full Name: <span class="required">*</span></label>
        <input type="text" id="FULLNAME" v-model="formData.FULLNAME" />
        <p v-if="errors.FULLNAME" class="error-message">
          {{ errors.FULLNAME }}
        </p>
      </div>
      <!-- Nhập email -->
      <div class="form-group">
        <label for="EMAIL">Email: <span class="required">*</span></label>
        <input type="email" id="EMAIL" v-model="formData.EMAIL" />
        <p v-if="errors.EMAIL" class="error-message">{{ errors.EMAIL }}</p>
      </div>
      <!-- Trường OTP xuất hiện khi cần thiết -->
      <div v-if="showOTPField" class="form-group">
        <label for="otp">OTP: <span class="required">*</span></label>
        <div class="otp-group">
          <input type="text" id="otp" v-model="otp" />
          <button
            type="button"
            @click="handleResendOTP"
            :disabled="otpResendDisabled"
          >
            {{
              otpResendDisabled ? `Nhận Mã (${otpResendCountdown}s)` : "Nhận Mã"
            }}
          </button>
        </div>
        <p v-if="errors.OTP" class="error-message">{{ errors.OTP }}</p>
      </div>
      <!-- Nhập địa chỉ -->
      <div class="form-group">
        <label for="ADDRESS">Address:</label>
        <input type="text" id="ADDRESS" v-model="formData.ADDRESS" />
      </div>
      <!-- Nhập giới tính -->
      <div class="form-group">
        <label for="GENDER">Gender:</label>
        <input type="text" id="GENDER" v-model="formData.GENDER" />
      </div>

      <!-- Đồng ý với các điều khoản -->
      <div class="form-group terms">
        <input type="checkbox" id="agreeTerms" v-model="agreeTerms" />
        <label for="agreeTerms">Tôi đã đồng ý với các điều khoản</label>
        <p v-if="errors.TERMS" class="error-message">{{ errors.TERMS }}</p>
      </div>

      <button type="submit">{{ showOTPField ? "Xác Thực" : "Đăng Ký" }}</button>
    </form>

    <p v-if="message" class="message">{{ message }}</p>
    <p v-if="otpMessage" class="message">{{ otpMessage }}</p>

    <!-- Đã có tài khoản -->
    <div class="login-link">
      <p>Đã có tài khoản? <a @click="goToLogin">Đăng nhập</a></p>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axiosClient from "../../api/axiosClient";

export default {
  data() {
    return {
      formData: {
        USERNAME: "",
        PASSWORD: "",
        CONFIRM_PASSWORD: "",
        FULLNAME: "",
        EMAIL: "",
        ADDRESS: "",
        GENDER: "",
      },
      confirmPassword: "",
      message: "",
      showOTPField: false,
      otp: "",
      otpMessage: "",
      errors: {
        USERNAME: "",
        PASSWORD: "",
        CONFIRM_PASSWORD: "",
        FULLNAME: "",
        EMAIL: "",
        OTP: "",
        TERMS: "", // Thêm lỗi điều khoản
      },
      agreeTerms: false, // Biến kiểm tra đồng ý điều khoản
      otpResendDisabled: false,
      otpResendCountdown: 60,
    };
  },
  methods: {
    validateForm() {
      this.errors = {
        USERNAME: "",
        PASSWORD: "",
        CONFIRM_PASSWORD: "",
        FULLNAME: "",
        EMAIL: "",
        OTP: "",
        TERMS: "", // Thêm lỗi điều khoản
      };

      let valid = true;

      if (!this.formData.USERNAME) {
        this.errors.USERNAME = "Username là bắt buộc";
        valid = false;
      }
      if (!this.formData.PASSWORD) {
        this.errors.PASSWORD = "Password bỏ trống";
        valid = false;
      }
      if (!this.confirmPassword) {
        this.errors.CONFIRM_PASSWORD = "Confirm Password bỏ trống";
        valid = false;
      } else if (this.confirmPassword !== this.formData.PASSWORD) {
        this.errors.CONFIRM_PASSWORD = "Password không đúng";
        valid = false;
      }
      if (!this.formData.FULLNAME) {
        this.errors.FULLNAME = "Full name bỏ trống";
        valid = false;
      }
      if (!this.formData.EMAIL) {
        this.errors.EMAIL =
          "bạn cần sử dụng email này trong trường hợp cần đặt lại mật khẩu";
        valid = false;
      }
      if (this.showOTPField && !this.otp) {
        this.errors.OTP = "Mã OTP chưa hợp lệ";
        valid = false;
      }
      if (!this.agreeTerms) {
        this.errors.TERMS = "Bạn phải đồng ý với các điều khoản để tiếp tục";
        valid = false;
      }

      return valid;
    },
    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      if (!this.showOTPField) {
        const payload = {
          USERNAME: this.formData.USERNAME,
          PASSWORD: this.formData.PASSWORD,
          FULLNAME: this.formData.FULLNAME,
          EMAIL: this.formData.EMAIL,
          ADDRESS: this.formData.ADDRESS,
          GENDER: this.formData.GENDER,
        };

        console.log("Payload data:", payload);

        try {
          const response = await axiosClient.post("/user/register", payload);
          this.message = response.data.message;

          if (response.data.success) {
            this.showOTPField = true;
          }
        } catch (error) {
          this.message =
            error.response?.data?.message || "Đăng ký người dùng thất bại";
          console.error("Error:", error.response?.data);
        }
      } else {
        const payload = {
          email: this.formData.EMAIL,
          otp: this.otp,
        };

        try {
          const response = await axiosClient.post(
            "/user/verifyOTPAndActivateUser",
            payload
          );

          this.otpMessage = response.data.message;
          if (response.data.user && response.data.user.IS_ACTIVATED) {
            this.showOTPField = false;

            Swal.fire({
              title: "Bạn đã đăng ký tài khoản thành công",
              icon: "success",
              confirmButtonText: "Trở lại đăng nhập",
            }).then((result) => {
              if (result.isConfirmed) {
                this.$router.push("/admin/login");
              }
            });
          }
        } catch (error) {
          this.otpMessage =
            error.response?.data?.message || "Xác thực OTP thất bại.";
          console.error("Error:", error.response?.data);
        }
      }
    },
    async handleResendOTP() {
      if (this.otpResendDisabled) return;

      try {
        const response = await axiosClient.post("/user/resendOTP", {
          email: this.formData.EMAIL,
        });

        if (response.data.success) {
          this.otpMessage = "Mã OTP mới đã được gửi đến email của bạn.";
          this.otpResendDisabled = true;
          this.startOTPTimer();
        }
      } catch (error) {
        this.otpMessage =
          error.response?.data?.message || "Gửi lại mã OTP thất bại.";
        console.error("Error:", error.response?.data);
      }
    },
    startOTPTimer() {
      this.otpResendCountdown = 60;
      const timer = setInterval(() => {
        this.otpResendCountdown -= 1;
        if (this.otpResendCountdown <= 0) {
          clearInterval(timer);
          this.otpResendDisabled = false;
        }
      }, 1000);
    },
    goToLogin() {
      this.$router.push("/admin/login");
    },
  },
};
</script>

<style scoped>
.register-form {
  max-width: 600px; /* Tăng chiều rộng form */
  margin: 0 auto;
  padding: 40px; /* Tăng padding */
  border: 1px solid #ccc;
  border-radius: 10px; /* Bo tròn góc nhiều hơn */
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Tạo bóng cho form */
}

h2 {
  text-align: center;
  font-size: 28px; /* Tăng kích thước chữ */
  font-weight: bold;
  color: #333;
  margin-bottom: 30px; /* Tăng khoảng cách dưới */
  text-transform: uppercase;
  letter-spacing: 2px; /* Tăng khoảng cách giữa các chữ */
  border-bottom: 3px solid #4caf50; /* Tăng độ dày đường viền dưới */
  padding-bottom: 10px; /* Tăng padding dưới */
}

.form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px; /* Tăng khoảng cách giữa các nhóm form */
}

label {
  font-weight: bold;
  font-size: 16px; /* Tăng kích thước chữ */
}

.required {
  color: red;
}

input[type="text"],
input[type="password"],
input[type="email"] {
  width: 100%;
  padding: 12px; /* Tăng padding */
  border: 1px solid #ccc;
  border-radius: 6px; /* Bo tròn góc nhiều hơn */
  font-size: 16px;
  transition: border-color 0.3s; /* Thêm hiệu ứng chuyển màu viền */
}

input[type="text"]:focus,
input[type="password"]:focus,
input[type="email"]:focus {
  border-color: #4caf50; /* Đổi màu viền khi focus */
}

.otp-group {
  display: flex;
  align-items: center;
}

.otp-group input[type="text"] {
  width: calc(100% - 100px); /* Điều chỉnh chiều rộng để có đủ chỗ cho nút */
  padding: 12px;
  border-radius: 6px 0 0 6px; /* Bo tròn góc trái */
}

.otp-group button {
  width: 100px;
  padding: 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 0 6px 6px 0; /* Bo tròn góc phải */
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s; /* Thêm hiệu ứng chuyển màu nền */
}

.otp-group button:disabled {
  background-color: #ccc;
}

button[type="submit"] {
  width: 100%;
  padding: 12px; /* Tăng padding */
  background-color: #4caf50; /* Đổi màu nền */
  color: #fff;
  border: none;
  border-radius: 6px; /* Bo tròn góc */
  cursor: pointer;
  font-size: 18px; /* Tăng kích thước chữ */
  font-weight: bold;
  transition: background-color 0.3s; /* Thêm hiệu ứng chuyển màu nền */
}

button[type="submit"]:hover {
  background-color: #388e3c; /* Đổi màu nền khi hover */
}

.message {
  margin-top: 20px; /* Tăng khoảng cách trên */
  text-align: center;
  font-weight: bold;
  color: #333; /* Đổi màu chữ */
  font-size: 16px; /* Tăng kích thước chữ */
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 5px; /* Tăng khoảng cách trên */
}

.login-link {
  margin-top: 20px; /* Tăng khoảng cách trên */
  text-align: center;
}

.terms {
  display: flex;
  align-items: center;
  margin-bottom: 20px; /* Tăng khoảng cách dưới */
}

.terms input[type="checkbox"] {
  margin-right: 10px;
}

.terms label {
  font-size: 14px; /* Tăng kích thước chữ */
  font-weight: bold;
}
</style>
