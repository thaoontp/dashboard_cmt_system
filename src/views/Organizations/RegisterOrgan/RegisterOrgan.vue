<template>
	<div class="containPage">
	  <section>
		<div class="container h-100">
		  <div class="row d-flex justify-content-center align-items-center h-100">
			<div class="col col-xl-10">
			  <div class="card loginForm">
				<div class="row g-0">
				  <div class="col-md-6 col-lg-6">
					<div class="wrapper">
					  <div class="title">Welcome Back!</div>
					  <p>
						<!-- Hãy đến với BooksHouse, bạn sẽ có được kiến thức, kinh
						nghiệm và trải nghiệm. -->
					  </p>
					  <router-link to="/organization/login" class="button btn-login">
						<span>SIGN IN</span>
					  </router-link>
					</div>
				  </div>
				  <div class="col-md-6 col-lg-6 d-flex align-items-center">
					<div class="card-body p-4 p-lg-4 text-black">
					  <form
						@submit.prevent="register"
						enctype="multipart/form-data"
					  >
						<div class="d-flex align-items-center mb-3">
						  <div class="titleWeb">Create account</div>
						</div>
						<div class="fw-normal desLogin">
						  Register for a store employee account
						</div>
						<div class="group">
						  <label for="phone"
							><i class="fa-solid fa-phone iconForm"></i
						  ></label>
						  <input
							type="text"
							id="phone"
							name="phone"
							class="groupInput"
							autocomplete="off"
							v-model="phone"
							placeholder="Nhập số điện thoại"
							required
						  />
						</div>
						<div class="group">
						  <label for="username"
							><i class="fa-solid fa-user iconForm"></i
						  ></label>
						  <input
							type="text"
							id="username"
							name="username"
							v-model="username"
							class="groupInput"
							autocomplete="off"
							placeholder="Nhập họ tên"
							required
						  />
						</div>
						<!-- <div class="group">
						  <label for="birth"
							><i class="fa-solid fa-user iconForm"></i
						  ></label>
						  <input
							type="date"
							id="birth"
							name="birth"
							v-model="birth"
							class="groupInput"
							autocomplete="off"
							required
						  />
						</div> -->
						<!-- <div class="group">
						  <label for="sex"
							><i class="fa-solid fa-user-tie iconForm"></i
						  ></label>
						  <select
							class="selectGroup"
							v-model="sex"
							name="sex"
							id="sex"
							required
						  >
							<option value="">Giới tính</option>
							<option value="Nam">Nam</option>
							<option value="Nữ">Nữ</option>
						  </select>
						</div> -->
  
						<!-- <div class="group">
						  <label for="address"
							><i class="fa-solid fa-map iconForm"></i
						  ></label>
						  <input
							type="text"
							id="address"
							name="address"
							v-model="address"
							class="groupInput"
							autocomplete="off"
							placeholder="Nhập địa chỉ"
							required
						  />
						</div> -->
						<div class="group2">
						  <label for="password"
							><i class="fa-solid fa-lock iconForm"></i
						  ></label>
						  <input
							:type="showPassword ? 'text' : 'password'"
							v-model="password"
							name="password"
							id="password"
							class="groupInput"
							autocomplete="off"
							placeholder="Nhập mật khẩu"
							required
						  />
						  <div @click="toggleShowPassword" class="iconPassword">
							<div v-if="showPassword">
							  <i class="fa-solid fa-eye"></i>
							</div>
							<div v-else>
							  <i class="fa-solid fa-eye-slash"></i>
							</div>
						  </div>
						</div>
						<!-- <div class="group">
						  <label for="avatar"
							><i class="fa-solid fa-image iconForm"></i
						  ></label>
						  <input
							type="file"
							id="avatar"
							class="groupInput"
							autocomplete="off"
							name="avatar"
							accept="image/jpeg, image/png, image/jpg"
							required
							ref="imageInput"
							@change="handleFileUpload"
						  />
						</div> -->
						<div class="pt-1 mb-4">
						  <button class="btnPay" type="submit">SIGN UP</button>
						</div>
					  </form>
					</div>
				  </div>
				</div>
			  </div>
			</div>
		  </div>
		</div>
	  </section>
	</div>
  </template>
  
  <script setup>
  import axios from "axios";
  import { ref } from "vue";
  import { toast } from "vue3-toastify";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  
  const phone = ref("");
  const username = ref("");
  const password = ref("");
  const address = ref("");
  const sex = ref("");
  const avatar = ref(null);
  const showPassword = ref(false);
  const isLoggedIn = () => {
	if (localStorage.getItem("isLoginDG") === "true") {
	  router.push("/");
	}
  };
  isLoggedIn();
  const toggleShowPassword = () => {
	showPassword.value = !showPassword.value;
  };
  
  const handleFileUpload = (e) => {
	avatar.value = e.target.files[0];
  };
  const register = async () => {
	const formData = new FormData();
	formData.append("username", username.value);
	formData.append("birth", birth.value);
	formData.append("sex", sex.value);
	formData.append("address", address.value);
	formData.append("phone", phone.value);
	formData.append("password", password.value);
	formData.append("avatar", avatar.value);
	console.log(formData);
  
	axios
	  .post("http://localhost:3000/authentication/register", formData)
	  .then((res) => {
		if (res.data.error) {
		  toast.error(res.data.error);
		} else {
		  router.push("/login");
		}
	  })
	  .catch((err) => console.log(err));
  };
  </script>
  <style lang="scss" scoped>
  @import "./RegisterOrgan.scss";
  </style>
  