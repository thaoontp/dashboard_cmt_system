<template>
	<div class="containPage" v-if="isLogin">
	  <h2>Dashboard</h2>
	  <div class="contentPage">
		<div class="listCard">
		  <div class="row pl-3">
			<div class="col">
			  <div class="cardInfo">
				<div class="leftCard">
				  <div class="iconCard">
					<i class="fa-solid fa-cart-shopping"></i>
				  </div>
				</div>
				<div class="rightCard">
				  <div class="numberCard">
					{{ totalUser }}
				  </div>
				  <div class="nameCard">Tổng User</div>
				</div>
			  </div>
			</div>
			<div class="col d-flex">
			  <div class="cardInfo">
				<div class="leftCard">
				  <div class="iconCard" style="background-color: #e9a4a4">
					<i class="fa-solid fa-ban" style="color: #d50d0d"></i>
				  </div>
				</div>
				<div class="rightCard">
				  <div class="numberCard">
					{{ totalActivated }}
				  </div>
				  <div class="nameCard">Tổng tài khoản đã kích hoạt</div>
				</div>
			  </div>
			</div>
			<div class="col d-flex">
			  <div class="cardInfo">
				<div class="leftCard">
				  <div class="iconCard" style="background-color: #cbe2ff">
					<i
					  class="fa-solid fa-hourglass-half"
					  style="color: #007bff"
					></i>
				  </div>
				</div>
				<div class="rightCard">
				  <div class="numberCard">
					{{ totalBlocked }}
				  </div>
				  <div class="nameCard">Số tài khoản bị khóa</div>
				</div>
			  </div>
			</div>
			<div class="col d-flex">
			  <div class="cardInfo">
				<div class="leftCard">
				  <div class="iconCard" style="background-color: #cdf1ef">
					<i class="fa-solid fa-user-tie" style="color: #05b9aa"></i>
				  </div>
				</div>
				<div class="rightCard">
				  <div class="numberCard">
					{{ totalStaff }}
				  </div>
				  <div class="nameCard">Tổng nhân viên</div>
				</div>
			  </div>
			</div>
			<div class="col d-flex">
			  <div class="cardInfo">
				<div class="leftCard">
				  <div class="iconCard" style="background-color: #e5cff7">
					<i class="fa-solid fa-user" style="color: #bc7af9"></i>
				  </div>
				</div>
				<div class="rightCard">
				  <div class="numberCard">
					{{ totalCustomer }}
				  </div>
				  <div class="nameCard">Tổng độc giả</div>
				</div>
			  </div>
			</div>
		  </div>
		</div>
	</div>
</div>
  </template>
  
  <script>
  import axiosClient from '../../../api/axiosClient';
  
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
  
  <style lang="scss" scoped>
  @import "Home.scss";
  </style>
  