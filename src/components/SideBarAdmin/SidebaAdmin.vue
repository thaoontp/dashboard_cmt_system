<template>
	<aside :class="`${is_expanded ? 'is-expanded' : ''}`">
	  <div class="logo">
		<img :src="logoURL" alt="Vue" />
		<span class="titleWeb text-info">COMMENTS<span class="text-warning">NE</span></span>
	  </div>
  
	  <Switch
	  	:checked="theme === 'dark'"
		@change="changeTheme"
		checked-children="Dark"
		un-checked-children="Light"
	  />
	  <br />
	  <br />
	  <a-menu class="menu"
		:theme="theme"
		:defaultOpenKeys="['sub1']"
		:selectedKeys="[current]"
		mode="inline"
		@click="onClick"
	  >
		<a-sub-menu key="sub1" title="Home" class="button">
		  <template #icon>
			<MailOutlined />
		  </template>
		  <a-menu-item key="1">
			<router-link to="/" style="text-decoration: none; color: inherit;">Home Page</router-link>
		  </a-menu-item>
		  <a-menu-item key="2">
			<router-link to="/user" style="text-decoration: none; color: inherit;">User</router-link>
		  </a-menu-item>
		  <a-menu-item key="3">
			<router-link to="/package" style="text-decoration: none; color: inherit;">Package</router-link>
		  </a-menu-item>
		  <!-- <a-menu-item key="4">Option 4</a-menu-item> -->
		</a-sub-menu>
		<a-sub-menu key="sub2" title="Organization">
		  <template #icon>
			<AppstoreOutlined />
		  </template>
		  <a-menu-item key="5">
			<router-link to="/organization/register">Register Organization</router-link>
		</a-menu-item>
		  <a-menu-item key="6">
			<router-link to="/organization/getOrganization">Organization List</router-link>
		</a-menu-item>
			<!-- <a-menu-item key="7">
				<router-link to="/organization/getUserByOrganization">Get User For Organization</router-link>
			</a-menu-item> -->
			<!-- <a-menu-item key="8">
				<router-link to="/organization/loginToOrganization">Login To Organization</router-link>
			</a-menu-item> -->
		  </a-sub-menu>
		<a-sub-menu key="sub4" title="Setting">
		  <template #icon>
			<SettingOutlined />
		  </template>
		  <a-menu-item key="9">Option 9</a-menu-item>
		  <a-menu-item key="10">Option 10</a-menu-item>
		  <a-menu-item key="11">Option 11</a-menu-item>
		  <a-menu-item key="12">Option 12</a-menu-item>
		</a-sub-menu>
	  </a-menu>

	  <div class="menu" style="margin-top: auto; padding-bottom: 30px;" @click="logout">
		<div class="button">
			<span class="material-icons"
			><i class="fa-solid fa-right-from-bracket"></i
			></span>
			<span class="text">Logout</span>
		</div>
		<a-modal
			title="Đăng xuất"
			:open="isModal"
			@ok="handleOk"
			@cancel="handleCancel"
			:ok-button-props="okButtonProps"
			okText="Đăng xuất"
			cancelText="Hủy"
		>
			<p>Bạn có chắc muốn đăng xuất khỏi hệ thống?</p>
		</a-modal>
    </div>
	</aside>
  </template>
  
  <script setup>	
  import { ref } from 'vue';
  import logoURL from '../../assets/AuthHeader.png';
  import { useRouter } from 'vue-router';
  import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue';
  
  
  const theme = ref('dark');
  const current = ref('1');
  
  const router = useRouter();
  
  const is_expanded = ref(localStorage.getItem('is_expanded') === 'true');
  
  const ToggleMenu = () => {
	is_expanded.value = !is_expanded.value;
	localStorage.setItem('is_expanded', is_expanded.value);
  };
  
  const logout = () => {
	localStorage.removeItem('token');
	router.push('/user/login');
  };
  
  const changeTheme = (value) => {
	theme.value = value ? 'dark' : 'light';
  };
  
  const onClick = (e) => {
	console.log('click ', e);
	current.value = e.key;
  };
  </script>
  
  <style lang="scss" scoped>
  @import "SideBarAdmin.scss";
  </style>
