import { createRouter, createWebHistory } from 'vue-router'

import AdminLayout from "../layouts/AdminLayout/AdminLayout.vue"
import AuthLayout from "../layouts/AuthLayout/AuthLayout.vue"

// router Admin
import LoginAdmin from "../views/LoginAdmin/LoginAdmin.vue"
import HomeAdmin from "../views/HomeAdmin/Home.vue"

import RegisterOrgan from "@/views/Organizations/RegisterOrgan/RegisterOrgan.vue"
import HomeOrgan from "../views/Organizations/HomeOrgan/HomeOrgan.vue"
import LoginOrgan from "../views/Organizations/LoginOrgan/LoginOrgan.vue"

const routes = [
	// router Admin
	{
		path: "/",
		component: HomeAdmin,
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
		path: "/organization/login",
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

export default router;