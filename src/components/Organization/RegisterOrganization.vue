<template>
    <div>
        <h2>Register Organization</h2>
        <form @submit.prevent="submitForm">
            <div>
                <label for="organizationName">Organization Name:</label>
                <input type="text" v-model="form.ORGANIZATION_NAME" id="organizationName" required />
            </div>
            <div>
                <label for="organizationEmail">Organization Email:</label>
                <input type="email" v-model="form.ORGANIZATION_EMAIL" id="organizationEmail" required />
            </div>
            <div>
                <label for="organizationPhone">Organization Phone:</label>
                <input type="text" v-model="form.ORGANIZATION_PHONE" id="organizationPhone" required />
            </div>
            <button type="button" @click="registerOrganization">Register</button>
        </form>
        <div v-if="error">
            <p>{{ error }}</p>
        </div>
    </div>
</template>

<script>
import axiosClient from '../../api/axiosClient';

export default {
    data() {
        return {
            form: {
                ORGANIZATION_NAME: '',
                ORGANIZATION_EMAIL: '',
                ORGANIZATION_PHONE: ''
            },
            error: null
        };
    },
    methods: {
        async submitForm() {
            await this.registerOrganization();
        },

        async registerOrganization() {
            try {
                const response = await axiosClient.post('/organization', this.form);
                if (response.data.success) {
                    alert('Organization registered successfully');
                    this.form = {
                        ORGANIZATION_NAME: '',
                        ORGANIZATION_EMAIL: '',
                        ORGANIZATION_PHONE: ''
                    };
                } else {
                    this.error = response.data.message;
                }
            } catch (error) {
                this.error = 'An error occurred while registering the organization.';
                console.error(error);
            }
        }
    }
};
</script>

<style scoped>
/* Thêm CSS */
</style>
