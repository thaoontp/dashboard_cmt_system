import { createRouter, createWebHistory } from 'vue-router'

import AdminLayout from "../layouts/AdminLayout/AdminLayout.vue"
import AuthLayout from "../layouts/AuthLayout/AuthLayout.vue"

// User
import RegisterUser from "../views/RegisterUser/RegisterUser.vue"

// router Admin
import HomeAdmin from "../views/HomeAdmin/MainHome/Home.vue"
import User from "../views/HomeAdmin/User/User.vue"
import LoginAdmin from "../views/LoginAdmin/LoginAdmin.vue"


import HomeOrgan from "../views/Organizations/HomeOrgan/HomeOrgan.vue"
import LoginOrgan from "../views/Organizations/LoginOrgan/LoginOrgan.vue"
import RegisterOrgan from "../views/Organizations/RegisterOrgan/RegisterOrganization.vue"

import store from "@/store"

const routes = [
	{
		path: "/user/register",
		component: RegisterUser,
		meta: {
			layout: AuthLayout,
		}
	},
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
		path: "/user/login",
		component: LoginAdmin,
		meta: {
			layout: AuthLayout,
		}
	},
	// router Organization
	{
		path: "/organization",
		component: HomeOrgan,
		meta: {
			layout: AdminLayout,
		}
	},
	{
		path: "/organization/register",
		component: RegisterOrgan,
		meta: {
			layout: AuthLayout,
		}
	},
	{
		path: "/organization/getUserByOrganization",
		component: LoginOrgan,
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
			next('/organization/login');
		}
	} else {
		next();
	}
});


export default router;
