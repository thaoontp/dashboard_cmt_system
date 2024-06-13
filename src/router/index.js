import { createRouter, createWebHistory } from 'vue-router';

import AdminLayout from '../layouts/AdminLayout/AdminLayout.vue';
import AuthLayout from '../layouts/AuthLayout/AuthLayout.vue';

// router Admin
import HomeAdmin from '../views/HomeAdmin/Home.vue';
import LoginAdmin from '../views/LoginAdmin/LoginAdmin.vue';

import RegisterOrganization from '../views/Organizations/RegisterOrgan/RegisterOrganization.vue';

const routes = [
	// router Admin
	{
		path: '/',
		component: HomeAdmin,
		meta: {
			layout: AdminLayout,
		},
	},
	{
		path: '/user/login',
		component: LoginAdmin,
		meta: {
			layout: AuthLayout,
		},
	},
	// Route Organization
	{
		path: '/organization',
		component: RegisterOrganization,
		meta: {
			layout: AuthLayout,
		},
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
