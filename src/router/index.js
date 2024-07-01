import { createRouter, createWebHistory } from 'vue-router'

import AdminLayout from "../layouts/AdminLayout/AdminLayout.vue"
import AuthLayout from "../layouts/AuthLayout/AuthLayout.vue"

// User
// import RegisterUser from "../views/RegisterUser/RegisterUser.vue"

// router Admin

import BlockUserAdmin from "@/views/HomeAdmin/BlockUser/BlockUser.vue"
import HomeAdmin from "@/views/HomeAdmin/MainHome/Home.vue"
import Packages from "@/views/HomeAdmin/Packages/Packages.vue"
import User from "@/views/HomeAdmin/User/User.vue"
import LoginAdmin from "../views/LoginAdmin/LoginAdmin.vue"


// Page Organization
import PageOrganLayout from "@/layouts/PageOrganLayout/PageOrganLayout.vue"
import store from "@/store"
import HistoryPage from "@/views/PageOrgan/History/History.vue"
import HomePageOrgan from "@/views/PageOrgan/HomePage/HomePage.vue"
import Instructions from "@/views/PageOrgan/Instructions/Instructions.vue"
import Invoice from "@/views/PageOrgan/Invoice/Invoice.vue"
import MenuPage from "@/views/PageOrgan/Menu/Menu.vue"
import Profile from "@/views/PageOrgan/Profile/Profile.vue"

import OrganizationsList from '../components/Organization/OrganizationsList.vue'
import UsersList from '../components/Organization/UsersList.vue'
import registerUser from '../components/pageOrganization/registerUser.vue'
import RegisterOrganization from '../views/Organizations/RegisterOrgan/RegisterOrganization.vue'
const routes = [
	// {
	// 	path: "/user/register",
	// 	component: RegisterUser,
	// 	meta: {
	// 		layout: AuthLayout,
	// 	}
	// },
	// router Admin
	{
		path: "/",
		component: HomeAdmin,
		meta: {
			layout: AdminLayout,
			// requiresAuth: true,
			// roles: ['admin'],
		}
	},
	{
		path: "/user",
		component: User,
		meta: {
			layout: AdminLayout,
		}
	},
	{
		path: "/user/blockUser",
		component: BlockUserAdmin,
		meta: {
			layout: AdminLayout,
		}
	},

	{
		path: "/package",
		component: Packages,
		meta: {
			layout: AdminLayout,
		}
	},
	{
		path: "/login",
		component: LoginAdmin,
		meta: {
			layout: AuthLayout,
		}
	},
	// router Organization
	{
		path: "/organization/register",
		component: RegisterOrganization,
		meta: {
			layout: PageOrganLayout,
		}
	},
	{
		path: "/organization/getOrganization",
		name: 'OrganizationsList',
		component: OrganizationsList,
		meta: {
			layout: AdminLayout,
		}
	},
	{
		path: '/organization/:id',
		name: 'UsersList',
		component: UsersList,
		meta: {
			layout: AdminLayout,
		},
		props: true,
	},

	// {
	// 	path: '/users/:userId',
	// 	name: 'UserDetail',
	// 	component: UserDetail,
	// 	meta: {
	// 		layout: AdminLayout,
	// 	},
	// 	props: true,
	// },
	// {
	// 	path: '/block-user/:userId',
	// 	name: 'BlockUser',
	// 	component: BlockUser,
	// 	meta: {
	// 		layout: AdminLayout,
	// 	},
	// 	props: true
	// },

	// Page Organization
	{
		path: "/pages/organizations",
		component: HomePageOrgan,
		meta: {
			layout: PageOrganLayout,
		}
	},
	{
		path: "/pages/menu",
		component: MenuPage,
		meta: {
			layout: PageOrganLayout,
		}
	},
	{
		path: "/pages/invoice",
		component: Invoice,
		meta: {
			layout: PageOrganLayout,
		}
	},
	{
		path: "/pages/history",
		component: HistoryPage,
		meta: {
			layout: PageOrganLayout,
		}
	},
	{
		path: "/pages/profile",
		component: Profile,
		meta: {
			layout: PageOrganLayout,
		}
	},
	{
		path: "/pages/instructions",
		component: Instructions,
		meta: {
			layout: PageOrganLayout,
		}
	},
	{
		path: "/register",
		component: registerUser,
		meta: {
			layout: AuthLayout,
		}
	},
]
const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach((to, from, next) => {
	const isLoggedIn = store.getters.isLoggedIn;
	const userInfo = store.getters.userInfo;

	let userRole = '';
	if (userInfo?.ROLE?.IS_ADMIN) {
		userRole = 'admin';
	} else if (userInfo?.ROLE?.IS_ORGANIZATION) {
		userRole = 'organization';
	} else {
		userRole = 'guest';
	}

	if (to.matched.some(record => record.meta.requiresAuth)) {
		if (isLoggedIn && to.matched.some(record => record.meta.roles && record.meta.roles.includes(userRole))) {
			next();
		} else {
			next('/login');
		}
	} else {
		next();
	}
});


export default router;
