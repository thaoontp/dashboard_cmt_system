<template>
    <div class="containPage">
      <h2>Danh sách người dùng</h2>
      <div class="contentPage" v-if="isLogin">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="Chưa active">
            <h4>Danh sách người dùng chưa active</h4>
            <a-table :dataSource="inactiveUsers" :columns="columnsInactive" rowKey="_id">
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="2" tab="Đang hoạt động" force-render>
            <h4>Danh sách người dùng đang hoạt động</h4>
            <a-table :dataSource="activeUsers" :columns="columnsActive" rowKey="_id">
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="3" tab="Bị block">
            <h4>Danh sách người dùng bị block</h4>
            <a-table :dataSource="blockedUsers" :columns="columnsBlocked" rowKey="_id">
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div v-else class="denied">
        <h3 class="text-center mt-5">Vui lòng đăng nhập để xử dụng dịch vụ</h3>
      </div>
    </div>
  </template>
  
  <script>
  import axiosClient from '../../../api/axiosClient'; 
  
  export default {
    data() {
      return {
        isLogin: true,
        activeKey: "1",
        inactiveUsers: [],
        activeUsers: [],
        blockedUsers: [],
  
        columnsInactive: [
          {
            title: "User Id",
            dataIndex: "_id",
            key: "_id",
          },
          {
            title: "User Name",
            dataIndex: "USERNAME",
            key: "USERNAME",
          },
          {
            title: "Full Name",
            dataIndex: "FULLNAME",
            key: "FULLNAME",
          },
          {
            title: "Trạng thái",
            dataIndex: "IS_ACTIVATED",
            key: "IS_ACTIVATED",
            
          },
        ],
  
        columnsActive: [
          {
            title: "User Id",
            dataIndex: "_id",
            key: "_id",
          },
          {
            title: "User Name",
            dataIndex: "USERNAME",
            key: "USERNAME",
          },
          {
            title: "Full Name",
            dataIndex: "FULLNAME",
            key: "FULLNAME",
          },
          {
            title: "Trạng thái",
            dataIndex: "IS_ACTIVATED",
            key: "IS_ACTIVATED",
            customRender: ({ text }) => {
            return text ? "Active" : "Active";
            }
          },
        ],
  
        columnsBlocked: [
          {
            title: "User Id",
            dataIndex: "_id",
            key: "_id",
          },
          {
            title: "User Name",
            dataIndex: "USERNAME",
            key: "USERNAME",
          },
          {
            title: "Full Name",
            dataIndex: "FULLNAME",
            key: "FULLNAME",
          },
          {
            title: "Trạng thái",
            dataIndex: "IS_BLOCKED",
            key: "IS_BLOCKED",
          },
        ],
      };
    },
    mounted() {
	  this.fetchUsers();
	}, 
    methods: {
      async fetchUsers() {
        try {
          const response = await axiosClient.get('/user/getUsers');
          const users = response.data;
          this.inactiveUsers = users.filter(user => !user.IS_ACTIVATED);
          this.activeUsers = users.filter(user => user.IS_ACTIVATED && !user.IS_BLOCKED);
          this.blockedUsers = users.filter(user => user.IS_ACTIVATED && user.IS_BLOCKED);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    }
  };
  </script>
  
  <style lang="scss" scoped>
  @import "./User.scss";
  </style>
  