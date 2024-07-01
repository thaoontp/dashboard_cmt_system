<template>
  <div class="containPage">
    <h2>Danh sách tổ chức</h2>

    <!-- Tabs navigation -->
    <ul class="navigation" v-if="isLoggedIn">
      <li
        :class="{ activeTab: currentTab === 'all' }"
        @click="changeTab('all')"
      >
        Tất cả
      </li>
      <li
        :class="{ activeTab: currentTab === 'unapproved' }"
        @click="changeTab('unapproved')"
      >
        Chưa duyệt
      </li>
      <li
        :class="{ activeTab: currentTab === 'approved' }"
        @click="changeTab('approved')"
      >
        Đã duyệt
      </li>
      <li
        :class="{ activeTab: currentTab === 'active' }"
        @click="changeTab('active')"
      >
        Đang hoạt động
      </li>
      <li
        :class="{ activeTab: currentTab === 'unactive' }"
        @click="changeTab('unactive')"
      >
        Ngừng hoạt động
      </li>
    </ul>
    <!-- Search bar -->
    <div class="search-bar" v-if="isLoggedIn">
      <input
        type="text"
        v-model="searchKeyword"
        @input="debouncedHandleSearch"
        placeholder="Nhập từ khóa tìm kiếm..."
      />
      <button class="searchButton" @click="handleSearch">Tìm kiếm</button>
    </div>
    <!-- Organization Lists -->
    <div v-if="isLoggedIn">
      <a-spin :spinning="isLoading">
        <div
          v-show="currentTab !== '' && filteredOrganizations.length > 0"
          class="organizationList"
        >
          <a-table
            :dataSource="filteredOrganizations"
            :columns="columns"
            rowKey="_id"
            :pagination="false"
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'index'">
                {{ (currentPage[currentTab] - 1) * perPage + index + 1 }}
              </template>
              <template v-if="column.dataIndex === '_id'">
                {{ record._id }}
              </template>
              <template v-else-if="column.dataIndex === 'ORGANIZATION_NAME'">
                {{ record.ORGANIZATION_NAME }}
              </template>
              <template v-else-if="column.dataIndex === 'USER_COUNT'">
                {{ record.USER_COUNT }}
              </template>
              <template v-else-if="column.dataIndex === 'ORGANIZATION_ACTIVE'">
                <span
                  :style="{
                    color: record.ORGANIZATION_ACTIVE.CHECK ? 'green' : 'grey',
                  }"
                >
                  {{
                    record.ORGANIZATION_ACTIVE.CHECK
                      ? "Đang Hoạt Động"
                      : "Ngừng Hoạt Động"
                  }}
                </span>
              </template>
              <template v-else-if="column.key === 'approveAction'">
                <template v-if="!record.OBJECT_APPROVED.CHECK">
                  <button
                    class="smallButton redButton"
                    @click="confirmApprove(record._id)"
                  >
                    Phê Duyệt
                  </button>
                </template>
                <template v-else>
                  <span class="approvedText"> Đã Phê Duyệt</span>
                </template>
              </template>
              <template v-else-if="column.key === 'viewUsersAction'">
                <template v-if="record.USER_COUNT === 0">
                  <span class="no-users-status">Chưa có người dùng nào</span>
                </template>
                <template v-else>
                  <button
                    class="smallButton blueButton"
                    @click="viewUsers(record)"
                  >
                    Danh Sách Người Dùng
                  </button>
                </template>
              </template>
              <template v-else-if="column.key === 'viewDetailAction'">
                <button
                  class="smallButton blueButton"
                  @click="viewDetail(record)"
                >
                  Xem Chi Tiết
                </button>
              </template>
            </template>
          </a-table>
          <!-- Pagination using Ant Design -->
          <div class="pagination">
            <a-pagination
              :current="currentPage[currentTab]"
              :total="totalPages[currentTab] * perPage"
              :pageSize="perPage"
              @change="handlePageChange"
              :hideOnSinglePage="true"
              class="ant-pagination"
            />
          </div>
        </div>
        <div
          v-show="currentTab !== '' && filteredOrganizations.length === 0"
          class="organizationList"
        >
          <p class="no-users">Không tìm thấy tổ chức phù hợp.</p>
        </div>
      </a-spin>
    </div>
    <div v-else class="denied">
      <h3>Vui lòng đăng nhập để sử dụng dịch vụ...</h3>
    </div>

    <!-- Selected Organization Detail -->
    <div
      ref="organizationDetail"
      v-if="selectedOrganization"
      class="organizationDetail"
    >
      <div class="detailHeader">
        <h2>Thông tin chi tiết tổ chức</h2>
        <button class="closeButton" @click="closeOrganizationDetail">
          <i class="fas fa-times-circle"></i>
        </button>
      </div>
      <div class="organizationDetail2">
        <p>
          <strong>Tên tổ chức:</strong>
          {{ selectedOrganization.ORGANIZATION_NAME }}
        </p>
        <p>
          <strong>Email tổ chức:</strong>
          {{ selectedOrganization.ORGANIZATION_EMAIL }}
        </p>
        <p>
          <strong>Điện thoại tổ chức:</strong>
          {{ selectedOrganization.ORGANIZATION_PHONE }}
        </p>
        <p>
          <strong>Trạng thái hoạt động:</strong>
          {{
            selectedOrganization.ORGANIZATION_ACTIVE.CHECK
              ? "Đang Hoạt Động"
              : "Ngừng Hoạt Động"
          }}
        </p>
        <p>
          <strong>Xét duyệt tổ chức:</strong>
          {{
            selectedOrganization.OBJECT_APPROVED.CHECK
              ? "Đã Được Duyệt"
              : "Chưa Được Duyệt"
          }}
        </p>
        <p>
          <strong>Ngày đăng ký:</strong>
          {{ formattedRegisterDate(selectedOrganization.REGISTER_DATE) }}
        </p>
      </div>
      <button class="blueButton" @click="viewUsers(selectedOrganization)">
        Xem Danh Sách Người Dùng
      </button>
    </div>
  </div>
</template>

<script>
import { Pagination, Spin, Table } from "ant-design-vue";
import _ from "lodash";
import moment from "moment";
import Swal from "sweetalert2";
import { mapState } from "vuex";
import axiosClient from "../../api/axiosClient";

export default {
  name: "OrganizationsList",
  components: {
    Spin,
    Table,
    Pagination,
  },
  data() {
    return {
      isLogin: false,
      isLoading: false,
      debouncedHandleSearch: _.debounce(this.handleSearch, 900),
      columns: [
        {
          title: "STT",
          key: "index",
          scopedSlots: { customRender: "index" },
          width: 50,
        },
        {
          title: "Tên tổ chức",
          dataIndex: "ORGANIZATION_NAME",
          key: "ORGANIZATION_NAME",
          width: 200,
        },
        {
          title: "Số lượng Người Dùng",
          dataIndex: "USER_COUNT",
          key: "USER_COUNT",
          width: 150,
        },
        {
          title: "Xem Danh Sách Người Dùng",
          key: "viewUsersAction",
          scopedSlots: { customRender: "action" },
          width: 200,
        },
        {
          title: "Trạng Thái",
          dataIndex: "ORGANIZATION_ACTIVE",
          key: "ORGANIZATION_ACTIVE",
          width: 150,
        },
        {
          title: "Duyệt Tổ Chức",
          key: "approveAction",
          scopedSlots: { customRender: "action" },
          width: 150,
        },
        {
          title: "Chi Tiết Tổ Chức",
          key: "viewDetailAction",
          scopedSlots: { customRender: "action" },
          width: 150,
        },
      ],
      currentPage: {
        all: 1,
        unapproved: 1,
        approved: 1,
        active: 1,
        unactive: 1,
      },
      totalPages: {
        all: 1,
        unapproved: 1,
        approved: 1,
        active: 1,
        unactive: 1,
      },
      perPage: 10,
      activeTab: "all",
      searchKeyword: "",
      selectedOrganization: null,
      allOrganizations: [],
      unapprovedOrganizations: [],
      approvedOrganizations: [],
      activeOrganizations: [],
      unactiveOrganizations: [],
    };
  },
  mounted() {
    this.fetchOrganizations("all");
    this.fetchOrganizations("unapproved");
    this.fetchOrganizations("approved");
    this.fetchOrganizations("active");
    this.fetchOrganizations("unactive");
  },
  methods: {
    async fetchOrganizations(tab, page = 1) {
      this.isLoading = true;
      try {
        const response = await axiosClient.get(
          `/organization/getOrganizations`,
          {
            params: {
              tab: tab,
              page: page,
              perPage: this.perPage,
              keyword: this.searchKeyword, // Thêm từ khóa vào params
            },
          }
        );

        if (response.status === 200) {
          const organizations = response.data.data;
          const totalItems = response.data.total;
          switch (tab) {
            case "all":
              this.allOrganizations = organizations;
              this.totalPages.all = Math.ceil(totalItems / this.perPage);
              this.currentPage.all = page;
              break;
            case "unapproved":
              this.unapprovedOrganizations = organizations;
              this.totalPages.unapproved = Math.ceil(totalItems / this.perPage);
              this.currentPage.unapproved = page;
              break;
            case "approved":
              this.approvedOrganizations = organizations;
              this.totalPages.approved = Math.ceil(totalItems / this.perPage);
              this.currentPage.approved = page;
              break;
            case "active":
              this.activeOrganizations = organizations;
              this.totalPages.active = Math.ceil(totalItems / this.perPage);
              this.currentPage.active = page;
              break;
            case "unactive":
              this.unactiveOrganizations = organizations;
              this.totalPages.unactive = Math.ceil(totalItems / this.perPage);
              this.currentPage.unactive = page;
              break;
            default:
              break;
          }
        } else {
          console.error("Error fetching organizations:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
      } finally {
        this.isLoading = false;
      }
    },
    viewDetail(organization) {
      this.selectedOrganization = organization;
      this.scrollToOrganizationDetail();
    },
    scrollToOrganizationDetail() {
      const element = this.$refs.organizationDetail;
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    formattedRegisterDate(date) {
      return moment(date).format("HH:mm DD/MM/YYYY");
    },
    viewUsers(organization) {
      this.$router.push({
        name: "UsersList",
        params: { id: organization._id },
      });
    },
    async approveOrganization(organizationId) {
      try {
        const response = await axiosClient.post(
          "/admin/approvedOrganizations",
          {
            organizationId,
            OBJECT_APPROVED: true,
          }
        );

        if (response.status === 200) {
          const approvedOrg = this.allOrganizations.find(
            (org) => org._id === organizationId
          );
          if (approvedOrg) {
            approvedOrg.OBJECT_APPROVED.CHECK = true;
          }

          if (
            this.selectedOrganization &&
            this.selectedOrganization._id === organizationId
          ) {
            this.selectedOrganization.OBJECT_APPROVED.CHECK = true;
          }

          if (this.currentTab === "approved") {
            this.fetchOrganizations("approved", this.currentPage.approved);
          }

          Swal.fire(
            "Thành công",
            "Tổ chức đã được phê duyệt thành công",
            "success"
          );
        } else {
          Swal.fire("Lỗi", "Có lỗi xảy ra khi phê duyệt tổ chức", "error");
          console.error("Error approving organization:", response.statusText);
        }
      } catch (error) {
        Swal.fire("Lỗi", "Có lỗi xảy ra khi phê duyệt tổ chức", "error");
        console.error("Error approving organization:", error);
      }
    },
    confirmApprove(organizationId) {
      Swal.fire({
        title: "Bạn có chắc chắn muốn phê duyệt tổ chức này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Phê Duyệt",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          this.approveOrganization(organizationId);
        }
      });
    },
    changeTab(tab) {
      this.activeTab = tab;
      if (!this.currentPage[tab]) {
        this.currentPage[tab] = 1;
      }
      if (!this.totalPages[tab]) {
        this.totalPages[tab] = 1;
      }
      this.fetchOrganizations(tab);
    },
    getOrganizations(tab) {
      switch (tab) {
        case "all":
          return this.allOrganizations;
        case "unapproved":
          return this.unapprovedOrganizations;
        case "approved":
          return this.approvedOrganizations;
        case "active":
          return this.activeOrganizations;
        case "unactive":
          return this.unactiveOrganizations;
        default:
          return [];
      }
    },
    handlePageChange(page) {
      this.fetchOrganizations(this.currentTab, page);
    },
    handleSearch() {
      this.currentPage[this.currentTab] = 1;
      this.fetchOrganizations(this.currentTab);
    },
    closeOrganizationDetail() {
      this.selectedOrganization = null;
    },
  },
  computed: {
    ...mapState(["isLoggedIn"]),
    currentTab() {
      return this.activeTab || "all";
    },
    filteredOrganizations() {
      const keyword = this.searchKeyword.toLowerCase();
      const organizations = this.getOrganizations(this.currentTab);

      if (keyword.trim() === "") {
        return organizations;
      }

      return organizations.filter((org) =>
        org.ORGANIZATION_NAME.toLowerCase().includes(keyword)
      );
    },
  },
  watch: {
    searchKeyword: {
      handler: function (val) {
        this.debouncedHandleSearch();
      },
    },
  },
};
</script>

<style scoped>
.containPage {
  padding: 20px;
  background-color: #f0f2f5;
  text-align: center;
}

h2 {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid #2e3a59;
  padding-bottom: 5px;
}

.navigation {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
  list-style-type: none;
  padding: 0;
}

.navigation li {
  background-color: #606677;
  color: #fff;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 2px;
  transition: background-color 0.3s ease;
  margin-right: 5px;
}

.navigation li.activeTab {
  background-color: #2e3a59;
}

.organizationList {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow-x: auto;
  min-width: 800px;
}

.organizationList .ant-table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.organizationDetail {
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.organizationDetail2 {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.organizationDetail2 p {
  margin: 8px 0;
}

.organizationDetail2 strong {
  font-weight: bold;
  margin-right: 5px;
}

.blueButton,
.approveButton {
  background-color: #1890ff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.redButton {
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.blueButton:hover,
.approveButton:hover {
  background-color: #40a9ff;
}

.redButton:hover {
  background-color: #ff7875;
}

.approvedText {
  color: #52c41a;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.denied {
  text-align: center;
  margin-top: 20px;
}

.denied h3 {
  color: #000000;
}

@media screen and (max-width: 768px) {
  .containPage {
    padding: 10px;
  }

  .organizationList,
  .organizationDetail {
    padding: 15px;
  }

  .button,
  .pagination button {
    padding: 8px 12px;
  }
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #000;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.search-bar {
  margin-bottom: 20px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-bar input[type="text"] {
  flex: 1;
  padding: 10px 15px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.search-bar input[type="text"]:focus {
  outline: none;
  border-color: #1890ff;
}

.search-bar input[type="text"]::placeholder {
  color: #999;
}

.searchButton {
  padding: 10px 20px;
  border: 1px solid #40a9ff;
  background-color: #40a9ff;
  color: white;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}

.searchButton:hover {
  background-color: #40a9ff;
}

.detailHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.closeButton {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #e70909;
  transition: color 0.3s ease;
}

.closeButton:hover {
  color: #ec4141;
}

.smallButton {
  margin-top: 5px;
  padding: 5px 10px;
  font-size: 15px;
  cursor: pointer;
}
.no-users {
  text-align: center;
  color: #555;
  font-size: 18px;
  margin-top: 20px;
}
.no-users-status {
  color: red;
  font-style: italic;
}
</style>
