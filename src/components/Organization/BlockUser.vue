<template>
  <div>
    <h2>Block User</h2>
    <p>Are you sure you want to block this user?</p>
    <button class="blueButton" @click="blockUser">Block User</button>
    <button class="greyButton" @click="cancelBlock">Cancel</button>
  </div>
</template>

<script>
import axiosClient from '../../api/axiosClient';

export default {
  name: 'BlockUser',
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  methods: {
    async blockUser() {
      try {
        const response = await axiosClient.post(`/organization/blockUserByOrganization/${this.userId}`);
        
        if (response.status === 200) {
          console.log('User blocked successfully');
          this.$router.push({ name: 'UserDetail', params: { userId: this.userId } });
        } else {
          console.error('Error blocking user:', response.statusText);
        }
      } catch (error) {
        console.error('Error blocking user:', error);
      }
    },
    cancelBlock() {
      this.$router.push({ name: 'UserDetail', params: { userId: this.userId } });
    }
  }
};
</script>

<style scoped>
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
.greyButton {
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
}
.greyButton:hover {
  background-color: #cccccc;
}
</style>
