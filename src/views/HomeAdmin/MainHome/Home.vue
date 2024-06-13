<template>
	<div class="containPage" v-if="isLogin">
	  <h2>Dashboard</h2>
	  <div class="contentPage">
		<div class="row">
		  <div class="col-md-4">
			<div class="card">
			  <div class="card-body">
				<h5 class="card-title">Tổng User</h5>
				<p class="card-text">{{ totalUser }}</p>
			  </div>
			</div>
		  </div>
		  <div class="col-md-4">
			<div class="card">
			  <div class="card-body">
				<h5 class="card-title">Tổng tài khoản đã kích hoạt</h5>
				<p class="card-text">{{ totalActivated }}</p>
			  </div>
			</div>
		  </div>
		  <div class="col-md-4">
			<div class="card">
			  <div class="card-body">
				<h5 class="card-title">Số tài khoản bị khóa</h5>
				<p class="card-text">{{ totalBlocked }}</p>
			  </div>
			</div>
		  </div>
		</div>
	  </div>
	</div>
	<div v-else class="denied">
	  <h3 class="text-center mt-5">Vui lòng đăng nhập để sử dụng dịch vụ</h3>
	</div>
  </template>
  
  <script>
  import axiosClient from '../../../api/axiosClient'; // Đường dẫn tới file axiosClient.js
  
  export default {
	data() {
	  return {
		isLogin: true,
		totalUser: 0,
		totalActivated: 0,
		totalBlocked: 0
	  };
	},
	mounted() {
	  this.fetchDashboardData();
	},
	methods: {
	  fetchDashboardData() {
		axiosClient.get('/user/totalUser')
		  .then(response => {
			this.totalUser = response.data.total;
		  })
		  .catch(error => {
			console.error('Error fetching total users:', error);
		  });
  
		// axiosClient.get('/users/activated')
		//   .then(response => {
		// 	this.totalActivated = response.data.total;
		//   })
		//   .catch(error => {
		// 	console.error('Error fetching total activated users:', error);
		//   });
  
		// axiosClient.get('/users/blocked')
		//   .then(response => {
		// 	this.totalBlocked = response.data.total;
		//   })
		//   .catch(error => {
		// 	console.error('Error fetching total blocked users:', error);
		//   });
	  }
	}
  };
  </script>
  
  <style scoped>
  /* Add your custom styles here */
  </style>
  