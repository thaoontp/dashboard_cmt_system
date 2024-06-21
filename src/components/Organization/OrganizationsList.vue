<template>
  <div class="containPage">
    <h2>Danh sách tổ chức</h2>

    <!-- Tabs navigation -->
    <ul class="navigation">
      <li :class="{ activeTab: activeTab === 'all' }" @click="changeTab('all')">Tất cả</li>
      <li :class="{ activeTab: activeTab === 'unapproved' }" @click="changeTab('unapproved')">Chưa duyệt</li>
      <li :class="{ activeTab: activeTab === 'approved' }" @click="changeTab('approved')">Đã duyệt</li>
      <li :class="{ activeTab: activeTab === 'active' }" @click="changeTab('active')">Đang hoạt động</li>
      <li :class="{ activeTab: activeTab === 'unactive' }" @click="changeTab('unactive')">Ngừng hoạt động</li>
    </ul>

    <!-- Organization Lists -->
    <div v-if="isLogin">
      <!-- Loading Spinner -->
      <a-spin :spinning="isLoading">
        <!-- All Organizations Tab -->
        <div v-show="activeTab === 'all'" class="organizationList">
          <a-table :dataSource="allOrganizations" :columns="columns" rowKey="_id">
            <template #bodyCell="{ column, record }">
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
                <span :style="{ color: record.ORGANIZATION_ACTIVE.CHECK ? 'green' : 'grey' }">
                  {{ record.ORGANIZATION_ACTIVE.CHECK ? 'Đang Hoạt Động' : 'Ngừng Hoạt Động' }}
                </span>
              </template>
              <template v-else-if="column.key === 'approveAction'">
                <template v-if="!record.OBJECT_APPROVED.CHECK">
                  <button class="redButton" @click="confirmApprove(record._id)">Phê Duyệt</button>
                </template>
                <template v-else>
                  <span class="approvedText"> Đã Phê Duyệt</span>
                </template>
              </template>
              <template v-else>
                <button class="blueButton" @click="viewDetail(record)">Xem Chi Tiết</button>
              </template>
            </template>
          </a-table>
          <div class="pagination">
            <button @click="previousPage('all')" :disabled="currentPage.all === 1">Previous</button>
            <span>Page {{ currentPage.all }} of {{ totalPages.all }}</span>
            <button @click="nextPage('all')" :disabled="currentPage.all === totalPages.all">Next</button>
          </div>
        </div>

        <!-- Unapproved Organizations Tab -->
        <div v-show="activeTab === 'unapproved'" class="organizationList">
          <a-table :dataSource="unapprovedOrganizations" :columns="columns" rowKey="_id">
            <template #bodyCell="{ column, record }">
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
                <span :style="{ color: record.ORGANIZATION_ACTIVE.CHECK ? 'green' : 'grey' }">
                  {{ record.ORGANIZATION_ACTIVE.CHECK ? 'Đang Hoạt Động' : 'Ngừng Hoạt Động' }}
                </span>
              </template>
              <template v-else-if="column.key === 'approveAction'">
                <template v-if="!record.OBJECT_APPROVED.CHECK">
                  <button class="redButton" @click="confirmApprove(record._id)">Phê Duyệt</button>
                </template>
                <template v-else>
                  <span class="approvedText"> Đã Phê Duyệt</span>
                </template>
              </template>
              <template v-else>
                <button class="blueButton" @click="viewDetail(record)">Xem Chi Tiết</button>
              </template>
            </template>
          </a-table>
          <div class="pagination">
            <button @click="previousPage('unapproved')" :disabled="currentPage.unapproved === 1">Previous</button>
            <span>Page {{ currentPage.unapproved }} of {{ totalPages.unapproved }}</span>
            <button @click="nextPage('unapproved')" :disabled="currentPage.unapproved === totalPages.unapproved">Next</button>
          </div>
        </div>

        <!-- Approved Organizations Tab -->
        <div v-show="activeTab === 'approved'" class="organizationList">
          <a-table :dataSource="approvedOrganizations" :columns="columns" rowKey="_id">
            <template #bodyCell="{ column, record }">
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
                <span :style="{ color: record.ORGANIZATION_ACTIVE.CHECK ? 'green' : 'grey' }">
                  {{ record.ORGANIZATION_ACTIVE.CHECK ? 'Đang Hoạt Động' : 'Ngừng Hoạt Động' }}
                </span>
              </template>
              <template v-else-if="column.key === 'approveAction'">
                <template v-if="!record.OBJECT_APPROVED.CHECK">
                  <button class="redButton" @click="confirmApprove(record._id)">Phê Duyệt</button>
                </template>
                <template v-else>
                  <span class="approvedText"> Đã Phê Duyệt</span>
                </template>
              </template>
              <template v-else>
                <button class="blueButton" @click="viewDetail(record)">Xem Chi Tiết</button>
              </template>
            </template>
          </a-table>
          <div class="pagination">
            <button @click="previousPage('approved')" :disabled="currentPage.approved === 1">Previous</button>
            <span>Page {{ currentPage.approved }} of {{ totalPages.approved }}</span>
            <button @click="nextPage('approved')" :disabled="currentPage.approved === totalPages.approved">Next</button>
          </div>
        </div>

        <!-- Active Organizations Tab -->
        <div v-show="activeTab === 'active'" class="organizationList">
          <a-table :dataSource="activeOrganizations" :columns="columns" rowKey="_id">
            <template #bodyCell="{ column, record }">
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
                <span :style="{ color: record.ORGANIZATION_ACTIVE.CHECK ? 'green' : 'grey' }">
                  {{ record.ORGANIZATION_ACTIVE.CHECK ? 'Đang Hoạt Động' : 'Ngừng Hoạt Động' }}
                </span>
              </template>
              <template v-else-if="column.key === 'approveAction'">
                <template v-if="!record.OBJECT_APPROVED.CHECK">
                  <button class="redButton" @click="confirmApprove(record._id)">Phê Duyệt</button>
                </template>
                <template v-else>
                  <span class="approvedText"> Đã Phê Duyệt</span>
                </template>
              </template>
              <template v-else>
                <button class="blueButton" @click="viewDetail(record)">Xem Chi Tiết</button>
              </template>
            </template>
          </a-table>
          <div class="pagination">
            <button @click="previousPage('active')" :disabled="currentPage.active === 1">Previous</button>
            <span>Page {{ currentPage.active }} of {{ totalPages.active }}</span>
            <button @click="nextPage('active')" :disabled="currentPage.active === totalPages.active">Next</button>
          </div>
        </div>

        <!-- Unactive Organizations Tab -->
        <div v-show="activeTab === 'unactive'" class="organizationList">
          <a-table :dataSource="unactiveOrganizations" :columns="columns" rowKey="_id">
            <template #bodyCell="{ column, record }">
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
                <span :style="{ color: record.ORGANIZATION_ACTIVE.CHECK ? 'green' : 'grey' }">
                  {{ record.ORGANIZATION_ACTIVE.CHECK ? 'Đang Hoạt Động' : 'Ngừng Hoạt Động' }}
                </span>
              </template>
              <template v-else-if="column.key === 'approveAction'">
                <template v-if="!record.OBJECT_APPROVED.CHECK">
                  <button class="redButton" @click="confirmApprove(record._id)">Phê Duyệt</button>
                </template>
                <template v-else>
                  <span class="approvedText"> Đã Phê Duyệt</span>
                </template>
              </template>
              <template v-else>
                <button class="blueButton" @click="viewDetail(record)">Xem Chi Tiết</button>
              </template>
            </template>
          </a-table>
          <div class="pagination">
            <button @click="previousPage('unactive')" :disabled="currentPage.unactive === 1">Previous</button>
            <span>Page {{ currentPage.unactive }} of {{ totalPages.unactive }}</span>
            <button @click="nextPage('unactive')" :disabled="currentPage.unactive === totalPages.unactive">Next</button>
          </div>
        </div>
      </a-spin>
    </div>
    <!-- Selected Organization Detail -->
    <div ref="organizationDetail" v-if="selectedOrganization" class="organizationDetail">
      <div>
        <h2>Thông tin chi tiết tổ chức</h2>
        <div class="organizationDetail2">
          <p><strong>Tên tổ chức:</strong> {{ selectedOrganization.ORGANIZATION_NAME }}</p>
          <p><strong>Email tổ chức:</strong> {{ selectedOrganization.ORGANIZATION_EMAIL }}</p>
          <p><strong>Điện thoại tổ chức:</strong> {{ selectedOrganization.ORGANIZATION_PHONE }}</p>
          <p><strong>Trạng thái hoạt động:</strong> {{ selectedOrganization.ORGANIZATION_ACTIVE.CHECK ? 'Đang Hoạt Động' : 'Ngừng Hoạt Động' }}</p>
          <p><strong>Xét duyệt tổ chức:</strong> {{ selectedOrganization.OBJECT_APPROVED.CHECK ? 'Đã Được Duyệt' : 'Chưa Được Duyệt' }}</p>
          <p><strong>Ngày đăng ký:</strong> {{ formattedRegisterDate(selectedOrganization.REGISTER_DATE) }}</p>
        </div>
      </div>
      <button class="blueButton" @click="viewUsers(selectedOrganization)">Xem Danh Sách Người Dùng</button>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import Swal from 'sweetalert2';
import axiosClient from '../../api/axiosClient';

export default {
  name: 'OrganizationsList',
  data() {
    return {
      isLogin: true,
      activeTab: 'all',
      isLoading: false,
      allOrganizations: [],
      unapprovedOrganizations: [],
      approvedOrganizations: [],
      activeOrganizations: [],
      columns: [
        { title: "Tên tổ chức", dataIndex: "ORGANIZATION_NAME", key: "ORGANIZATION_NAME" },
        { title: "Số lượng User", dataIndex: "USER_COUNT", key: "USER_COUNT" },
        { title: "Trạng Thái", dataIndex: "ORGANIZATION_ACTIVE", key: "ORGANIZATION_ACTIVE" },
        { title: "Chi Tiết Tổ Chức", key: "action", scopedSlots: { customRender: "action" } },
        { title: "Duyệt Tổ Chức", key: "approveAction", scopedSlots: { customRender: "action" } }
      ],
      currentPage: {
        all: 1,
        unapproved: 1,
        approved: 1,
        active: 1,
        unactive: 1
      },
      totalPages: {
        all: 1,
        unapproved: 1,
        approved: 1,
        active: 1,
        unactive: 1
      },
      perPage: 10,
      // perPage: {
      //   all: 5,
      //   unapproved: 10,
      //   approved: 10
      // },
      selectedOrganization: null
    };
  },
  mounted() {
    this.fetchOrganizations('all');
    this.fetchOrganizations('unapproved');
    this.fetchOrganizations('approved');
    this.fetchOrganizations('active');
    this.fetchOrganizations('unactive');
  },
  methods: {
    async fetchOrganizations(tab, page = this.currentPage[tab]) {
      this.isLoading = true;
      try {
        const response = await axiosClient.get('/organization/getOrganizations', {
          params: {
            page,
            perPage: this.perPage,
          }
        });

        if (response.status === 200) {
          const organizations = response.data.data;
          switch (tab) {
            case 'all':
              this.allOrganizations = organizations;
              this.totalPages.all = Math.ceil(response.data.total / this.perPage);
              this.currentPage.all = page;
              break;
            case 'unapproved':
              this.unapprovedOrganizations = organizations.filter(org => !org.OBJECT_APPROVED.CHECK);
              this.totalPages.unapproved = Math.ceil(this.unapprovedOrganizations.length / this.perPage);
              this.currentPage.unapproved = page;
              break;
            case 'approved':
              this.approvedOrganizations = organizations.filter(org => org.OBJECT_APPROVED.CHECK);
              this.totalPages.approved = Math.ceil(this.approvedOrganizations.length / this.perPage);
              this.currentPage.approved = page;
              break;
            case 'active':
              this.activeOrganizations = organizations.filter(org => org.ORGANIZATION_ACTIVE.CHECK);
              this.totalPages.active = Math.ceil(this.activeOrganizations.length / this.perPage);
              this.currentPage.active = page;
              break;
            case 'unactive':
              this.unactiveOrganizations = organizations.filter(org => !org.ORGANIZATION_ACTIVE.CHECK);
              this.totalPages.unactive = Math.ceil(this.unactiveOrganizations.length / this.perPage);
              this.currentPage.unactive = page;
              break;
            default:
              break;
          }
        } else {
          console.error('Error fetching organizations:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    }
  },

  viewDetail(organization) {
    this.isLoading = true;
    setTimeout(() => {
      this.selectedOrganization = organization;
      this.scrollToOrganizationDetail();
      this.isLoading = false;
    }, 500);
  },
  scrollToOrganizationDetail() {
    const element = this.$refs.organizationDetail;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },
    formattedRegisterDate(date) {
      return moment(date).format('HH:mm DD/MM/YYYY');
    },
    viewUsers(organization) {
    this.isLoading = true;
    setTimeout(() => {
      this.$router.push({ name: 'UsersList', params: { id: organization._id } });
      this.isLoading = false;
    }, 500);
  },
  previousPage(tab) {
    if (this.currentPage[tab] > 1) {
      this.isLoading = true;
      setTimeout(() => {
        this.currentPage[tab]--;
        this.fetchOrganizations(tab, this.currentPage[tab]);
        this.isLoading = false;
      }, 500);
    }
  },
  nextPage(tab) {
    if (this.currentPage[tab] < this.totalPages[tab]) {
      this.isLoading = true;
      setTimeout(() => {
        this.currentPage[tab]++;
        this.fetchOrganizations(tab, this.currentPage[tab]);
        this.isLoading = false;
      }, 500);
    }
  },
    async approveOrganization(organizationId) {
      try {
        const response = await axiosClient.post('/admin/approvedOrganizations', {
          organizationId,
          OBJECT_APPROVED: true
        });

        if (response.status === 200) {
          const approvedOrg = this.allOrganizations.find(org => org._id === organizationId);
          if (approvedOrg) {
            approvedOrg.OBJECT_APPROVED.CHECK = true;
          }

          if (this.selectedOrganization && this.selectedOrganization._id === organizationId) {
            this.selectedOrganization.OBJECT_APPROVED.CHECK = true;
          }

          // Refresh data for approved tab if applicable
          if (this.activeTab === 'approved') {
            this.fetchOrganizations('approved', this.currentPage.approved);
          }

          Swal.fire('Thành công', 'Tổ chức đã được phê duyệt thành công', 'success');
        } else {
          Swal.fire('Lỗi', 'Có lỗi xảy ra khi phê duyệt tổ chức', 'error');
          console.error('Error approving organization:', response.statusText);
        }
      } catch (error) {
        Swal.fire('Lỗi', 'Có lỗi xảy ra khi phê duyệt tổ chức', 'error');
        console.error('Error approving organization:', error);
      }
    },
    confirmApprove(organizationId) {
      Swal.fire({
        title: 'Bạn có chắc chắn muốn phê duyệt tổ chức này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Phê Duyệt',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          this.approveOrganization(organizationId);
        }
      });
    },
    changeTab(tab) {
      this.activeTab = tab;
      this.currentPage[tab] = 1;
      this.fetchOrganizations(tab);
    }
  }
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
    border-bottom: 2px solid #4CAF50;
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
  background-color: #79d17c;
  color: #fff;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 2px;
  transition: background-color 0.3s ease;
  margin-right: 5px;
}

.navigation li.activeTab {
  background-color: #4CAF50;
}

.organizationList {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
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


.blueButton, .approveButton {
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

.blueButton:hover, .approveButton:hover {
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

.denied {
  text-align: center;
  margin-top: 20px;
}

.denied h3 {
  color: #ff4d4f;
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
  to { transform: rotate(360deg); }
}

</style>