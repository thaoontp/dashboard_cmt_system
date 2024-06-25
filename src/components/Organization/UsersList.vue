<template>
  <div class="containPage">
    <h2>Danh sách người dùng thuộc tổ chức</h2>
    <button class="blueButton backButton" @click="backToOrganizations">
      Back to Organizations
    </button>
    <div class="userSearch">
      <label for="userSearchInput">Tìm kiếm User:</label>
      <input
        type="text"
        id="userSearchInput"
        v-model="userSearchInput"
        :placeholder="placeholderText"
        @input="debouncedSearchUsers"
      />
      <button class="blueButton" @click="searchUsers">Tìm kiếm</button>
    </div>
    <ul class="navigation">
      <li :class="{ activeTab: activeTab === 'all' }" @click="changeTab('all')">
        Tất cả
      </li>
      <li
        :class="{ activeTab: activeTab === 'active' }"
        @click="changeTab('active')"
      >
        Đang Hoạt Động
      </li>
      <li
        :class="{ activeTab: activeTab === 'inactive' }"
        @click="changeTab('inactive')"
      >
        Chưa Xác Thực
      </li>
      <li
        :class="{ activeTab: activeTab === 'blocked' }"
        @click="changeTab('blocked')"
      >
        Đã Bị Khóa
      </li>
    </ul>
    <!-- Bảng danh sách người dùng -->
    <table class="custom-table">
      <thead>
        <tr>
          <th class="fixedColumn">User Name</th>
          <th class="fixedColumn">Full Name</th>
          <th class="fixedColumn">Trạng thái</th>
          <th class="fixedColumn">Chi Tiết</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user._id">
          <td>{{ user.USERNAME }}</td>
          <td>{{ user.FULLNAME }}</td>
          <td>
            <span
              :style="{
                color: user.IS_BLOCKED.CHECK
                  ? 'red'
                  : user.IS_ACTIVATED
                  ? 'green'
                  : 'orange',
              }"
            >
              {{
                user.IS_BLOCKED.CHECK
                  ? "Đã Bị Khóa"
                  : !user.IS_ACTIVATED
                  ? "Chưa Xác Thực"
                  : "Đang Hoạt Động"
              }}
            </span>
          </td>
          <td>
            <button class="blueButton" @click="showUserDetail(user)">
              Xem Người Dùng
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <a-pagination
      :current="currentPage"
      :total="totalUsers"
      :pageSize="limit"
      @change="handlePaginationChange"
      class="pagination"
    />

    <!-- Nút quay lại tổ chức -->
    <!-- <div>
      <button class="blueButton" @click="backToOrganizations">
        Back to Organizations
      </button>
    </div> -->

    <!-- Loading spinner -->
    <div v-if="loading" class="loading-spinner"></div>

    <!-- Chi tiết người dùng -->
    <div v-if="selectedUser" class="userDetail" ref="userDetail">
      <h2>Thông tin chi tiết người dùng</h2>
      <div class="userDetailInfo">
        <p><strong>Tên Tài Khoản: </strong> {{ selectedUser.USERNAME }}</p>
        <p><strong>Họ Tên Người Dùng: </strong> {{ selectedUser.FULLNAME }}</p>
        <p><strong>Email: </strong> {{ selectedUser.EMAIL }}</p>
        <p><strong>Địa Chỉ: </strong> {{ selectedUser.ADDRESS }}</p>
        <p><strong>Giới Tính: </strong> {{ selectedUser.GENDER }}</p>
        <p>
          <strong>Trạng Thái Tài Khoản: </strong>
          <span
            :style="{
              color: selectedUser.IS_BLOCKED.CHECK
                ? 'red'
                : selectedUser.IS_ACTIVATED
                ? 'green'
                : 'orange',
            }"
          >
            {{
              selectedUser.IS_BLOCKED.CHECK
                ? "Đã Bị Khóa"
                : !selectedUser.IS_ACTIVATED
                ? "Chưa Xác Thực"
                : "Đang Hoạt Động"
            }}
          </span>
        </p>
      </div>
      <div class="userDetailActions">
        <button
          v-if="!selectedUser.IS_BLOCKED.CHECK"
          class="redButton"
          @click="confirmToggleBlock(selectedUser)"
        >
          Block User
        </button>
        <button
          v-else
          class="blueButton"
          @click="confirmToggleBlock(selectedUser)"
        >
          Unlock User
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Pagination as APagination, Modal } from "ant-design-vue";
import _ from "lodash";
import axiosClient from "../../api/axiosClient";

export default {
  name: "UsersList",
  components: {
    APagination,
  },
  props: ["id"],
  data() {
    return {
      userSearchInput: "",
      users: [],
      currentPage: 1,
      totalUsers: 0,
      limit: 10,
      selectedUser: null,
      loading: false,
      debouncedSearchUsers: _.debounce(this.searchUsers, 300),
      activeTab: "all",
      tabPages: {
        all: 1,
        active: 1,
        inactive: 1,
        blocked: 1,
      },
    };
  },
  computed: {
    placeholderText() {
      return this.userSearchInput.trim() === ""
        ? "Vui lòng nhập tên hoặc tên tài khoản người dùng"
        : "";
    },
    filteredUsers() {
      const startIndex = (this.currentPage - 1) * this.limit;
      return this.users.slice(startIndex, startIndex + this.limit);
    },
  },
  watch: {
    currentPage() {
      this.fetchUsersByOrganizationId();
    },
    activeTab() {
      this.fetchUsersByOrganizationId();
    },
    userSearchInput: _.debounce(function () {
      this.currentPage = 1;
      this.fetchUsersByOrganizationId();
    }, 300),
  },
  mounted() {
    this.fetchUsersByOrganizationId();
  },
  methods: {
    async fetchUsersByOrganizationId() {
      this.loading = true;
      try {
        const response = await axiosClient.get(
          `/organization/getUserByOrganization`,
          {
            headers: {
              ORGANIZATION_ID: this.id,
            },
            params: {
              page: this.currentPage,
              limit: this.limit,
              search: this.userSearchInput,
              status: this.activeTab,
            },
          }
        );

        if (response.status === 200) {
          const result = response.data;
          this.users = result.data;
          this.totalUsers = result.totalUsers;
        } else {
          console.error("Error fetching users:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        this.loading = false;
      }
    },

    async showUserDetail(user) {
      this.loading = true;
      this.selectedUser = user;
      await new Promise((resolve) => setTimeout(resolve, 500));
      this.$nextTick(() => {
        const element = this.$refs.userDetail;
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        this.loading = false;
      });
    },
    confirmToggleBlock(user) {
      const action = user.IS_BLOCKED.CHECK ? "Unlock" : "Block";
      Modal.confirm({
        title: `Confirm ${action}`,
        content: `Bạn có chắc muốn ${action.toLowerCase()} người dùng này?`,
        onOk: () => this.handleAction(() => this.toggleUserBlockStatus(user)),
      });
    },
    async toggleUserBlockStatus(user) {
      try {
        const response = await axiosClient.put(
          `/organization/blockUserByOrganization/${user._id}`,
          {},
          {
            headers: {
              ORGANIZATION_ID: this.id,
            },
          }
        );

        if (response.status === 200) {
          this.selectedUser.IS_BLOCKED.CHECK =
            !this.selectedUser.IS_BLOCKED.CHECK;
          this.fetchUsersByOrganizationId();
        } else {
          console.error(
            "Error updating user block status:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error updating user block status:", error);
      }
    },
    backToOrganizations() {
      this.$router.push({ name: "OrganizationsList" });
    },
    handlePaginationChange(page) {
      this.currentPage = page;
    },
    async handleAction(action) {
      this.loading = true;
      await action();
      await new Promise((resolve) => setTimeout(resolve, 500));
      this.loading = false;
    },
    async searchUsers() {
      this.currentPage = 1;
      await this.fetchUsersByOrganizationId();
    },
    changeTab(tab) {
      this.activeTab = tab;
      this.currentPage = this.tabPages[this.activeTab];
    },
  },
};
</script>

<style scoped>
.containPage {
  max-width: 1200px;
  margin: 0 auto;
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

.userSearch input[type="text"],
.userSearch button {
  padding: 8px;
  font-size: 14px;
  height: 30px;
  border-radius: 4px;
}

.userSearch input[type="text"] {
  flex-grow: 1;
  border: 1px solid #d9d9d9;
  outline: none;
  transition: border-color 0.3s ease;
}

.userSearch input[type="text"]:focus {
  border-color: #1890ff;
}

.userSearch button {
  min-width: 80px;
  margin-left: 10px;
  background-color: #1890ff;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.userSearch button:hover {
  background-color: #40a9ff;
}

.userSearch button:active {
  transform: translateY(1px);
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

.userSearch input[type="text"]::placeholder,
.userSearch input[type="text"]:-ms-input-placeholder,
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
  justify-content: center;
  margin-top: 20px;
}

.navigation {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
  list-style-type: none;
  padding: 0;
}

.navigation li {
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 2px;
  margin-right: 5px;
}

.navigation li.activeTab {
  background-color: #4caf50;
  color: #fff;
}

.navigation li:not(.activeTab) {
  background-color: #79d17c;
  color: #fff;
}

.redButton,
.blueButton {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 4px;
}

.redButton:hover,
.blueButton:hover {
  background-color: #40a9ff;
}

.redButton {
  background-color: #f5222d;
}

.redButton:hover {
  background-color: #ff4d4f;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.custom-table th,
.custom-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.custom-table th {
  background-color: #f2f2f2;
}

.fixedColumn {
  width: 25%;
  min-width: 150px;
  max-width: 300px;
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
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

h2 {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid #4caf50;
  padding-bottom: 5px;
}

.backButton {
  margin-bottom: 10px;
  margin-right: 10px;
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .backButton {
    font-size: 12px;
    padding: 3px 8px;
  }
}
</style>
