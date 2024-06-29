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
        <div class="password-input-group">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="PASSWORD"
            v-model="formData.PASSWORD"
          />
          <span @click="togglePasswordVisibility">
            <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
          </span>
        </div>
        <p v-if="errors.PASSWORD" class="error-message">
          {{ errors.PASSWORD }}
        </p>
      </div>
      <!-- Nhập lại mật khẩu -->
      <div class="form-group">
        <label for="CONFIRM_PASSWORD"
          >Confirm Password: <span class="required">*</span></label
        >
        <div class="password-input-group">
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            id="CONFIRM_PASSWORD"
            v-model="confirmPassword"
          />
          <span @click="toggleConfirmPasswordVisibility">
            <i
              :class="showConfirmPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"
            ></i>
          </span>
        </div>
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
        <p v-if="errors.otp" class="error-message">{{ errors.otp }}</p>
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

      <button type="submit">{{ showOTPField ? "Xác Thực" : "Đăng Ký" }}</button>
    </form>

    <p v-if="message" class="message">{{ message }}</p>
    <p v-if="otpMessage" class="message">{{ otpMessage }}</p>

    <div class="login-link">
      <p>Bạn đã có tài khoản? <a @click="goToLogin">Đăng nhập</a></p>
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
      showPassword: false,
      showConfirmPassword: false,
      errors: {
        USERNAME: "",
        PASSWORD: "",
        CONFIRM_PASSWORD: "",
        FULLNAME: "",
        EMAIL: "",
        OTP: "",
      },
      otpResendDisabled: false,
      otpResendCountdown: null,
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    validateForm() {
      this.errors = {
        USERNAME: "",
        PASSWORD: "",
        CONFIRM_PASSWORD: "",
        FULLNAME: "",
        EMAIL: "",
        OTP: "",
      };

      let valid = true;

      if (!this.formData.USERNAME) {
        this.errors.USERNAME = "Tên người dùng là bắt buộc.";
        valid = false;
      }
      if (!this.formData.PASSWORD) {
        this.errors.PASSWORD = "Mật khẩu là bắt buộc.";
        valid = false;
      }
      if (!this.confirmPassword) {
        this.errors.CONFIRM_PASSWORD = "Xác nhận mật khẩu là bắt buộc.";
        valid = false;
      } else if (this.confirmPassword !== this.formData.PASSWORD) {
        this.errors.CONFIRM_PASSWORD = "Mật khẩu không khớp.";
        valid = false;
      }
      if (!this.formData.FULLNAME) {
        this.errors.FULLNAME = "Họ và tên là bắt buộc.";
        valid = false;
      }
      if (!this.formData.EMAIL) {
        this.errors.EMAIL = "Email là bắt buộc.";
        valid = false;
      }
      if (this.showOTPField && !this.otp) {
        this.errors.otp = "Mã OTP là bắt buộc.";
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

        try {
          const response = await axiosClient.post("/user/register", payload);
          this.message = response.data.message;

          if (response.data.success) {
            this.showOTPField = true;
            this.startNewOTPTimer();
          }
        } catch (error) {
          if (error.response?.data?.errors) {
            const serverErrors = error.response.data.errors;
            this.errors = { ...this.errors, ...serverErrors };
          } else if (error.response?.data?.message) {
            this.message = error.response.data.message;
          } else {
            this.message = "Đăng ký người dùng thất bại";
          }
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

          // this.otpMessage = response.data.message;
          if (response.data.user && response.data.user.IS_ACTIVATED) {
            this.showOTPField = false;

            Swal.fire({
              title: "Bạn đã đăng ký tài khoản thành công",
              icon: "success",
              confirmButtonText: "Trở lại đăng nhập",
            }).then((result) => {
              if (result.isConfirmed) {
                this.$router.push("/login");
              }
            });
          } else {
            this.startNewOTPTimer();
          }
        } catch (error) {
          if (error.response?.data?.errors) {
            const serverErrors = error.response.data.errors;
            this.errors = { ...this.errors, ...serverErrors };
          } else if (error.response?.data?.message) {
            this.errors.otp = error.response.data.message;
          } else {
            this.errors.otp = "Xác thực OTP thất bại.";
          }
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
          // this.otpMessage = "Mã OTP mới đã được gửi đến email của bạn.";
          this.otpResendDisabled = true;
          this.startNewOTPTimer();
        }
      } catch (error) {
        this.otpMessage =
          error.response?.data?.message || "Gửi lại mã OTP thất bại.";
        console.error("Error:", error.response?.data);
      }
    },
    startNewOTPTimer() {
      this.otpResendCountdown = 30;
      this.otpResendDisabled = true;

      const countdown = () => {
        if (this.otpResendCountdown > 0) {
          setTimeout(() => {
            this.otpResendCountdown--;
            countdown();
          }, 1000);
        } else {
          this.otpResendDisabled = false;
        }
      };

      countdown();
    },
    goToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.register-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  font-size: 26px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid #4caf50;
  padding-bottom: 10px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-weight: bold;
  font-size: 14px;
  color: #555;
}

.required {
  color: red;
}

input[type="text"],
input[type="password"],
input[type="email"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="password"]:focus,
input[type="email"]:focus {
  border-color: #4caf50;
  outline: none;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
}

.otp-group {
  display: flex;
  align-items: center;
}

.otp-group input[type="text"] {
  width: calc(100% - 100px);
  padding: 12px;
  border-radius: 6px 0 0 6px;
}

.otp-group button {
  width: 100px;
  padding: 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 0 6px 6px 0;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.otp-group button:disabled {
  background-color: #ccc;
}

button[type="submit"] {
  width: 100%;
  padding: 12px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s;
}

button[type="submit"]:hover {
  background-color: #388e3c;
}

.message {
  margin-top: 15px;
  text-align: center;
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

.error-message {
  color: red;
  font-size: 12px;
}

.login-link {
  margin-top: 15px;
  text-align: center;
}

.login-link a {
  color: blue;
  text-decoration: none;
  transition: color 0.3s, text-decoration 0.3s;
}

.login-link a:hover {
  color: black;
  text-decoration: underline;
}

.terms {
  display: flex;
  align-items: center;
  gap: 10px;
}

.terms input[type="checkbox"] {
  margin-right: 5px;
}

.terms label {
  font-size: 14px;
  font-weight: bold;
}

.password-input-group {
  display: flex;
  align-items: center;
}

.password-input-group input {
  flex: 1;
}

.password-input-group span {
  cursor: pointer;
  margin-left: 8px;
}

.fa-eye,
.fa-eye-slash {
  font-size: 1.2em;
}
</style>
