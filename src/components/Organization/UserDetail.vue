<template>
  <div class="containPage">
    <h2>Thông tin chi tiết người dùng</h2>
    <div v-if="user">
      <p><strong>Username:</strong> {{ user.USERNAME }}</p>
      <p><strong>Full Name:</strong> {{ user.FULLNAME }}</p>
      <p><strong>Email:</strong> {{ user.EMAIL }}</p>
      <p><strong>Address:</strong> {{ user.ADDRESS }}</p>
      <p><strong>Gender:</strong> {{ user.GENDER }}</p>
      <p><strong>BLOCK:</strong> {{ user.IS_BLOCKED }}</p>
    </div>
    <button v-if="!user.IS_BLOCKED" class="redButton" @click="redirectToBlockUserPage(user)">Block User</button>
    <p v-else>User is Blocked</p>
    <button class="blueButton" @click="backToUsersList">Back to Users List</button>
  </div>
</template>

<script>
import axiosClient from '../../api/axiosClient';

export default {
  name: 'UserDetail',
  data() {
    return {
      user: {},
    };
  },
  mounted() {
    this.fetchUserDetail();
  },
  methods: {
    async fetchUserDetail() {
      const userId = this.$route.params.userId;
      try {
        const response = await axiosClient.get(`/organization/getUserDetails/${userId}`);

        if (response.status === 200) {
          this.user = response.data.data;
        } else {
          console.error('Error fetching user detail:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user detail:', error);
      }
    },
    redirectToBlockUserPage(user) {
      this.$router.push({ name: 'BlockUser', params: { userId: user.USER_ID } });
    },
    backToUsersList() {
      this.$router.go(-1);
    }
  }
};
</script>


<style scoped>
.redButton {
  background-color: #f5222d;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
}
.redButton:hover {
  background-color: #ff4d4f;
}
.blueButton {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
}
.blueButton:hover {
  background-color: #40a9ff;
}
</style>
