<template>
	<aside :class="`${is_expanded ? 'is-expanded' : ''}`">
	  <div class="logo">
		<img :src="logoURL" alt="Vue" />
	  </div>
  
	  <div class="menu-toggle-wrap">
		<button class="menu-toggle" @click="ToggleMenu">
		  <span class="material-icons">keyboard_double_arrow_right</span>
		</button>
	  </div>
  
	  <Switch
	  	:checked="theme === 'dark'"
		@change="changeTheme"
		checked-children="Dark"
		un-checked-children="Light"
	  />
	  <br />
	  <br />
	  <a-menu
		:theme="theme"
		:defaultOpenKeys="['sub1']"
		:selectedKeys="[current]"
		mode="inline"
		@click="onClick"
	  >
		<a-sub-menu key="sub1" title="Home">
		  <template #icon>
			<MailOutlined />
		  </template>
		  <a-menu-item key="1">
			<router-link to="/user">User</router-link>
		  </a-menu-item>
		  <a-menu-item key="2">
			<router-link to="/package">Package</router-link>
		  </a-menu-item>
		  <a-menu-item key="3">Option 3</a-menu-item>
		  <a-menu-item key="4">Option 4</a-menu-item>
		</a-sub-menu>
		<a-sub-menu key="sub2" title="Organization">
		  <template #icon>
			<AppstoreOutlined />
		  </template>
		  <a-menu-item key="5">
			<router-link to="/organization/register">Register Organization</router-link>
		</a-menu-item>
		  <a-menu-item key="6">
			<router-link to="/organization/getUserByOrganization">Register Organization</router-link>
		</a-menu-item>
		  <a-sub-menu key="sub3" title="Submenu">
			<a-menu-item key="7">Option 7</a-menu-item>
			<a-menu-item key="8">Option 8</a-menu-item>
		  </a-sub-menu>
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

	  <div class="menu" @click="logout">
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
  import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import logoURL from '../../assets/logo.png';
  
  
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
aside {
	display: flex;
	flex-direction: column;
	background-color: var(--dark);
	color: var(--light);
	width: calc(2rem + 32px);
	overflow: hidden;
	min-height: 100vh;
	padding: 0.5rem;
	transition: 0.2s ease-in-out;

	.flex {
		flex: 1 1 0%;
	}

	.logo {
		margin-bottom: 1rem;
		img {
			width: 2rem;
		}
	}

	.menu-toggle-wrap {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 1rem;
		position: relative;
		top: 0;
		transition: 0.2s ease-in-out;

		.menu-toggle {
			transition: 0.2s ease-in-out;
			.material-icons {
				font-size: 2rem;
				color: var(--light);
				transition: 0.2s ease-out;
			}

			&:hover {
				.material-icons {
					color: var(--primary);
					transform: translateX(0.5rem);
				}
			}
		}
	}

	h3,
	.button .text {
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
	}

	h3 {
		color: var(--grey);
		font-size: 0.875rem;
		margin-bottom: 0.5rem;
		text-transform: uppercase;
	}

	.menu {
		margin: 0 -1rem;
		.button {
			display: flex;
			align-items: center;
			text-decoration: none;
			transition: 0.2s ease-in-out;
			padding: 0.5rem 1rem;
			margin-top: auto;
			.material-icons {
				font-size: 2rem;
				color: var(--light);
				transition: 0.2s ease-in-out;
			}
			.text {
				color: var(--light);
				transition: 0.2s ease-in-out;
			}
			&:hover {
				background-color: var(--dark-alt);
				.material-icons,
				.text {
					color: var(--primary);
				}
			}
			&.router-link-exact-active {
				background-color: var(--dark-alt);
				border-right: 5px solid var(--primary);
				.material-icons,
				.text {
					color: var(--primary);
				}
			}
		}
	}

	.footer {
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
		p {
			font-size: 0.875rem;
			color: var(--grey);
		}
	}

	&.is-expanded {
		width: var(--sidebar-width);
		.menu-toggle-wrap {
			top: -3rem;
			.menu-toggle {
				transform: rotate(-180deg);
			}
		}
		h3,
		.button .text {
			opacity: 1;
		}
		.button {
			.material-icons {
				margin-right: 1rem;
			}
		}
		.footer {
			opacity: 0;
		}
	}

	@media (max-width: 1024px) {
		position: absolute;
		z-index: 99;
	}

	// Style for Ant Design Menu
	.ant-menu {
		width: 256px; // Set the width of the menu
	}
	.logout-button {
  		margin-top: auto; 
		margin-bottom: 30px;
}
}
</style>
