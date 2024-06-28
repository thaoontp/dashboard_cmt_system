<template>
  <div class="containPage">
    <h2>Danh sách người dùng thuộc tổ chức</h2>
    <button class="blueButton backButton" @click="backToOrganizations">
      Back to Organizations
    </button>
    <div class="userSearch">
      <input
        type="text"
        id="userSearchInput"
        v-model="search"
        :placeholder="placeholderText"
        @input="debouncedSearch"
        class="searchInput"
      />
      <button class="searchButton" @click="searchUsers">Tìm kiếm</button>
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
          <th class="fixedColumn sttColumn">STT</th>
          <th class="fixedColumn">User Name</th>
          <th class="fixedColumn">Full Name</th>
          <th class="fixedColumn">Trạng thái</th>
          <th class="fixedColumn">Chi Tiết</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in currentUsers" :key="user._id">
          <td>{{ (currentPage[activeTab] - 1) * limit + index + 1 }}</td>
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
    <div class="pagination">
      <a-pagination
        :current="currentPage[activeTab]"
        :total="totalPages[activeTab] * limit"
        :page-size="limit"
        @change="handlePageChange"
        :hide-on-single-page="true"
      />
    </div>
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
import { Input, Modal, Pagination } from "ant-design-vue";
import _ from "lodash";
import axiosClient from "../../api/axiosClient";

export default {
  name: "UsersList",
  components: {
    Pagination,
    "a-input-search": Input.Search,
  },
  props: ["id"],
  data() {
    return {
      search: "",
      allUsers: [],
      activeUsers: [],
      inactiveUsers: [],
      blockedUsers: [],
      limit: 10,
      selectedUser: null,
      loading: false,
      debouncedSearch: _.debounce(this.searchUsers, 700),
      activeTab: "all",
      currentPage: {
        all: 1,
        active: 1,
        inactive: 1,
        blocked: 1,
      },
      totalPages: {
        all: 1,
        active: 1,
        inactive: 1,
        blocked: 1,
      },
    };
  },
  computed: {
    placeholderText() {
      return this.search.trim() === ""
        ? "Vui lòng nhập tên hoặc tên tài khoản người dùng"
        : "";
    },
    currentUsers() {
      switch (this.activeTab) {
        case "all":
          return this.allUsers;
        case "active":
          return this.activeUsers;
        case "inactive":
          return this.inactiveUsers;
        case "blocked":
          return this.blockedUsers;
      }
    },
  },
  watch: {
    currentPage: {
      deep: true,
      handler() {
        this.fetchUsersByOrganizationId();
      },
    },
    activeTab() {
      this.fetchUsersByOrganizationId();
    },
    search: _.debounce(function () {
      this.currentPage[this.activeTab] = 1;
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
              page: this.currentPage[this.activeTab],
              limit: this.limit,
              search: this.search,
              status: this.activeTab,
            },
          }
        );

        if (response.status === 200) {
          const result = response.data;
          const users = result.data;
          const totalItems = result.totalUsers;
          const page = this.currentPage[this.activeTab];

          switch (this.activeTab) {
            case "all":
              this.allUsers = users;
              this.totalPages.all = Math.ceil(totalItems / this.limit);
              this.currentPage.all = page;
              break;
            case "active":
              this.activeUsers = users;
              this.totalPages.active = Math.ceil(totalItems / this.limit);
              this.currentPage.active = page;
              break;
            case "inactive":
              this.inactiveUsers = users;
              this.totalPages.inactive = Math.ceil(totalItems / this.limit);
              this.currentPage.inactive = page;
              break;
            case "blocked":
              this.blockedUsers = users;
              this.totalPages.blocked = Math.ceil(totalItems / this.limit);
              this.currentPage.blocked = page;
              break;
          }
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
    handlePageChange(page) {
      this.currentPage[this.activeTab] = page;
    },
    async handleAction(action) {
      this.loading = true;
      await action();
      await new Promise((resolve) => setTimeout(resolve, 500));
      this.loading = false;
    },
    async searchUsers() {
      this.currentPage[this.activeTab] = 1;
      await this.fetchUsersByOrganizationId();
    },
    changeTab(tab) {
      this.activeTab = tab;
      this.currentPage[this.activeTab] = this.currentPage[this.activeTab] || 1;
      this.fetchUsersByOrganizationId();
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
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.userSearch .searchInput {
  width: 100%;
  max-width: 400px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  outline: none;
  font-size: 16px;
  transition: border-color 0.3s;
}

.userSearch .searchInput:focus {
  border-color: #1890ff;
}

.userSearch .searchButton {
  padding: 10px 20px;
  border: 1px solid #1890ff;
  background-color: #1890ff;
  color: white;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}

.userSearch .searchButton:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
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
  width: 15%; /* Thêm kích thước cố định cho cột */
}

.fixedColumn.sttColumn {
  width: 5%; /* Kích thước cố định cho cột STT */
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
