<template>
  <div class="containPage">
    <h2>Danh sách người dùng thuộc tổ chức</h2>
    <div class="userSearch">
      <label for="userSearchInput">Tìm kiếm User:</label>
      <input type="text" id="userSearchInput" v-model="userSearchInput" :placeholder="placeholderText" @input="debouncedSearchUsers">
      <button class="blueButton" @click="searchUsers">Tìm kiếm</button>
    </div>
    <a-table :dataSource="users" :columns="columns" rowKey="_id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'USERNAME'">
          {{ record.USERNAME }}
        </template>
        <template v-else-if="column.dataIndex === 'FULLNAME'">
          {{ record.FULLNAME }}
        </template>
        <template v-else-if="column.dataIndex === 'IS_BLOCKED'">
          <span :style="{ color: record.IS_BLOCKED.CHECK ? 'red' : 'green' }">
            {{ record.IS_BLOCKED.CHECK ? 'Đã Bị Khóa' : 'Đang Hoạt Động' }}
          </span>
        </template>
        <template v-else>
          <button class="blueButton" @click="handleAction(() => showUserDetail(record))">Xem Người Dùng</button>
        </template>
      </template>
    </a-table>
    <div class="pagination">
      <button @click="previousPage()" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage()" :disabled="currentPage === totalPages">Next</button>
    </div>
    <div><button class="blueButton" @click="backToOrganizations">Back to Organizations</button></div>
    <div v-if="loading" class="loading-spinner"></div>
    <div v-if="selectedUser" class="userDetail" ref="userDetail">
      <h2>Thông tin chi tiết người dùng</h2>
      <div class="userDetailInfo">
        <p><strong>Tên Tài Khoản: </strong> {{ selectedUser.USERNAME }}</p>
        <p><strong>Họ Tên Người Dùng: </strong> {{ selectedUser.FULLNAME }}</p>
        <p><strong>Email: </strong> {{ selectedUser.EMAIL }}</p>
        <p><strong>Địa Chỉ: </strong> {{ selectedUser.ADDRESS }}</p>
        <p><strong>Giới Tính: </strong> {{ selectedUser.GENDER }}</p>
        <p><strong>Trạng Thái Tài Khoản: </strong>
          <span :style="{ color: selectedUser.IS_BLOCKED.CHECK ? 'red' : 'green' }">
            {{ selectedUser.IS_BLOCKED.CHECK ? 'Đã Bị Khóa' : 'Đang Hoạt Động' }}
          </span>
        </p>
      </div>
      <div class="userDetailActions">
        <button v-if="!selectedUser.IS_BLOCKED.CHECK" class="redButton" @click="handleAction(() => confirmToggleBlock(selectedUser))">Block User</button>
        <button v-else class="blueButton" @click="handleAction(() => confirmToggleBlock(selectedUser))">Unlock User</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue';
import _ from 'lodash';
import axiosClient from '../../api/axiosClient';

export default {
  name: 'UsersList',
  props: ['id'],
  data() {
    return {
      userSearchInput: '',
      users: [],
      originalUsers: [],
      columns: [
        { title: "User Name", dataIndex: "USERNAME", key: "USERNAME" },
        { title: "Full Name", dataIndex: "FULLNAME", key: "FULLNAME" },
        { title: "Trạng thái", dataIndex: "IS_BLOCKED", key: "IS_BLOCKED" },
        { title: "Chi Tiết Người Dùng", key: "action", scopedSlots: { customRender: "action" }}
      ],
      currentPage: 1,
      totalPages: 0,
      limit: 2,
      selectedUser: null,
      loading: false,
      debouncedSearchUsers: _.debounce(this.searchUsers, 300)
    };
  },
  computed: {
    placeholderText() {
      return this.userSearchInput.trim() === '' ? 'Vui lòng nhập tên hoặc tên tài khoản người dùng' : '';
    }
  },
  mounted() {
    this.fetchUsersByOrganizationId();
  },
  methods: {
    async fetchUsersByOrganizationId() {
      try {
        const response = await axiosClient.get(`/organization/getUserByOrganization`, {
          headers: {
            ORGANIZATION_ID: this.id,
          },
          params: {
            page: this.currentPage,
            limit: this.limit,
            search: this.userSearchInput
          },
        });

        if (response.status === 200) {
          const result = response.data;
          this.originalUsers = result.data;
          this.users = [...this.originalUsers];
          this.totalPages = result.totalPages;
          this.currentPage = result.currentPage;
        } else {
          console.error('Error fetching users:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async showUserDetail(user) {
      this.loading = true;
      this.selectedUser = user;
      await new Promise(resolve => setTimeout(resolve, 500));
      this.$nextTick(() => {
        const element = this.$refs.userDetail;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        this.loading = false;
      });
    },
    confirmToggleBlock(user) {
      const action = user.IS_BLOCKED.CHECK ? 'Unlock' : 'Block';
      Modal.confirm({
        title: `Confirm ${action}`,
        content: `Bạn có chắc muốn ${action.toLowerCase()} người dùng này?`,
        onOk: () => this.handleAction(() => this.toggleUserBlockStatus(user)),
      });
    },
    async toggleUserBlockStatus(user) {
      try {
        const response = await axiosClient.put(`/organization/blockUserByOrganization/${user._id}`, {}, {
          headers: {
            ORGANIZATION_ID: this.id
          }
        });

        if (response.status === 200) {
          this.selectedUser.IS_BLOCKED.CHECK = !this.selectedUser.IS_BLOCKED.CHECK;
          this.fetchUsersByOrganizationId();
        } else {
          console.error('Error updating user block status:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating user block status:', error);
      }
    },
    backToOrganizations() {
      this.$router.push({ name: 'OrganizationsList' });
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchUsersByOrganizationId();
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchUsersByOrganizationId();
      }
    },
    async handleAction(action) {
      this.loading = true;
      await action();
      await new Promise(resolve => setTimeout(resolve, 500));
      this.loading = false;
    },
    async searchUsers() {
      this.currentPage = 1; // Reset to first page for new search
      await this.fetchUsersByOrganizationId();
    }
  }
};
</script>

<style scoped>
.containPage {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.userSearch {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.userSearch label {
  margin-right: 10px;
  font-size: 14px;
}

.userSearch input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
  height: 30px;
}

.userSearch input:focus {
  border-color: #1890ff;
}

.userSearch button {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 8px 16px;
  margin-left: 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
  height: 30px;
}

.userSearch button:hover {
  background-color: #40a9ff;
}

.userSearch button:focus {
  outline: none;
}

.userSearch button:active {
  transform: translateY(1px);
}

.userSearch label,
.userSearch input,
.userSearch button {
  height: 30px;
}

.userSearch label,
.userSearch button {
  display: inline-block;
  vertical-align: middle;
}

.userSearch input {
  flex-grow: 1;
}

.userSearch button {
  min-width: 80px;
}

.userSearch button.blueButton {
  background-color: #1890ff;
}

.userSearch button.blueButton:hover {
  background-color: #40a9ff;
}

.userSearch button.redButton {
  background-color: #f5222d;
}

.userSearch button.redButton:hover {
  background-color: #ff4d4f;
}

.userSearch button:disabled {
  background-color: #d9d9d9;
  cursor: not-allowed;
}

.userSearch button:disabled:hover {
  background-color: #d9d9d9;
}

.userSearch button:disabled:active {
  transform: none;
}

.userSearch input[type="text"]::placeholder {
  color: #ccc;
}

.userSearch input[type="text"]:-ms-input-placeholder {
  color: #ccc;
}

.userSearch input[type="text"]::-ms-input-placeholder {
  color: #ccc;
}

.userDetail {
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.userDetail h2 {
  margin-bottom: 20px;
}

.userDetailInfo {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.userDetailInfo p {
  margin: 8px 0;
}

.userDetailInfo strong {
  font-weight: bold;
  margin-right: 5px;
}

.userDetailInfo p:last-child {
  margin-bottom: 0;
}

.userDetailActions {
  margin-top: 20px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #1890ff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.pagination button:hover {
  background-color: #40a9ff;
}

.redButton {
  background-color: #f5222d;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 4px;
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
  border-radius: 4px;
}

.blueButton:hover {
  background-color: #40a9ff;
}

.loading-spinner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 8px solid #f3f3f3;
  border-radius: 50%;
  border-top: 8px solid #3498db;
  width: 60px;
  height: 60px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

h2 {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 5px;
}
</style>
