<template>
  <div class="register-form">
    <h2>Register</h2>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="USERNAME">Username: <span class="required">*</span></label>
        <input type="text" id="USERNAME" v-model="formData.USERNAME" />
        <p v-if="errors.USERNAME" class="error-message">
          {{ errors.USERNAME }}
        </p>
      </div>
      <div class="form-group">
        <label for="PASSWORD">Password: <span class="required">*</span></label>
        <div class="password-input-group">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="PASSWORD"
            v-model="formData.PASSWORD"
          />
          <span @click="togglePasswordVisibility" class="password-toggle">
            <svg
              v-if="showPassword"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-eye"
              viewBox="0 0 16 16"
            >
              <path
                d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zm-8 4.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"
              />
              <path
                d="M8 3a5 5 0 0 0-4.546 2.916A5.508 5.508 0 0 1 8 3zm0 10a5 5 0 0 0 4.546-2.916A5.508 5.508 0 0 1 8 13zM1.172 8a6.509 6.509 0 0 1 0-2h13.656a6.509 6.509 0 0 1 0 2H1.172z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-eye-slash"
              viewBox="0 0 16 16"
            >
              <path
                d="M13.359 11.238l-1.442-1.442A5.5 5.5 0 0 1 1.057 7.803a.563.563 0 0 0 0 .395c1.18 2.086 3.695 3.977 6.943 3.977 1.046 0 2.044-.147 2.959-.403zM11.3 4.29c-.508-.161-1.038-.29-1.591-.381l-.447-.447C7.841 3.057 7.094 3 6.511 3a6.5 6.5 0 0 0-.428 12.967A8.47 8.47 0 0 0 8 14.5a5.5 5.5 0 0 1 4.301-10.21zM5.658 3.443L1.007 7.5h13.986L10.341 3.443A7.013 7.013 0 0 0 8 3a7.015 7.015 0 0 0-2.342.443zM2.757 12.243A8.71 8.71 0 0 0 8 15a8.71 8.71 0 0 0 5.243-1.757L2.757 12.243z"
              />
            </svg>
          </span>
        </div>
        <p v-if="errors.PASSWORD" class="error-message">
          {{ errors.PASSWORD }}
        </p>
      </div>
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
          <span
            @click="toggleConfirmPasswordVisibility"
            class="password-toggle"
          >
            <svg
              v-if="showConfirmPassword"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-eye"
              viewBox="0 0 16 16"
            >
              <path
                d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zm-8 4.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"
              />
              <path
                d="M8 3a5 5 0 0 0-4.546 2.916A5.508 5.508 0 0 1 8 3zm0 10a5 5 0 0 0 4.546-2.916A5.508 5.508 0 0 1 8 13zM1.172 8a6.509 6.509 0 0 1 0-2h13.656a6.509 6.509 0 0 1 0 2H1.172z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-eye-slash"
              viewBox="0 0 16 16"
            >
              <path
                d="M13.359 11.238l-1.442-1.442A5.5 5.5 0 0 1 1.057 7.803a.563.563 0 0 0 0 .395c1.18 2.086 3.695 3.977 6.943 3.977 1.046 0 2.044-.147 2.959-.403zM11.3 4.29c-.508-.161-1.038-.29-1.591-.381l-.447-.447C7.841 3.057 7.094 3 6.511 3a6.5 6.5 0 0 0-.428 12.967A8.47 8.47 0 0 0 8 14.5a5.5 5.5 0 0 1 4.301-10.21zM5.658 3.443L1.007 7.5h13.986L10.341 3.443A7.013 7.013 0 0 0 8 3a7.015 7.015 0 0 0-2.342.443zM2.757 12.243A8.71 8.71 0 0 0 8 15a8.71 8.71 0 0 0 5.243-1.757L2.757 12.243z"
              />
            </svg>
          </span>
        </div>
        <p v-if="errors.CONFIRM_PASSWORD" class="error-message">
          {{ errors.CONFIRM_PASSWORD }}
        </p>
      </div>
      <div class="form-group">
        <label for="FULLNAME">Full Name: <span class="required">*</span></label>
        <input type="text" id="FULLNAME" v-model="formData.FULLNAME" />
        <p v-if="errors.FULLNAME" class="error-message">
          {{ errors.FULLNAME }}
        </p>
      </div>
      <div class="form-group">
        <label for="EMAIL">Email: <span class="required">*</span></label>
        <input type="email" id="EMAIL" v-model="formData.EMAIL" />
        <p v-if="errors.EMAIL" class="error-message">{{ errors.EMAIL }}</p>
      </div>
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
      <div class="form-group">
        <label for="ADDRESS">Address:</label>
        <input type="text" id="ADDRESS" v-model="formData.ADDRESS" />
      </div>
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
  border-bottom: 2px solid #2e3a59;
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
  margin-bottom: 20px;
}

label {
  font-weight: bold;
  font-size: 14px;
  color: #555;
}

.required {
  color: red;
  font-size: 12px;
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
  font-size: 12px;
  color: #555;
}

.password-input-group {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.password-toggle svg {
  width: 20px;
  height: 20px;
  fill: #888;
}
</style>
