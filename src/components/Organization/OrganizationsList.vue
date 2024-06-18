<template>
  <div class="containPage">
    <h2>Danh sách tổ chức</h2>
    <div class="organizationList" v-if="isLogin">
      <a-table :dataSource="organizations" :columns="columns" rowKey="_id">
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
          <template v-else>
            <button @click="viewDetail(record)">Danh sách User</button>
          </template>
        </template>
      </a-table>
      <div class="pagination">
        <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
    <div v-else class="denied">
      <h3 class="text-center mt-5">Vui lòng đăng nhập để sử dụng dịch vụ</h3>
    </div>
  </div>
</template>

<script>
import axiosClient from '../../api/axiosClient';

export default {
  name: 'OrganizationsList',
  data() {
    return {
      isLogin: true,
      organizations: [],
      columns: [
        // { title: "Organization ID", dataIndex: "_id", key: "_id" },
        { title: "Tên tổ chức", dataIndex: "ORGANIZATION_NAME", key: "ORGANIZATION_NAME" },
        { title: "Số lượng User", dataIndex: "USER_COUNT", key: "USER_COUNT" },
        { title: "Chi Tiết User", key: "action", scopedSlots: { customRender: "action" } }
      ],
      currentPage: 1,
      totalPages: 0,
      perPage: 5,
    };
  },
  mounted() {
    this.fetchOrganizations();
  },
  methods: {
    async fetchOrganizations(page = this.currentPage) {
      try {
        const response = await axiosClient.get('/organization/getOrganizations', {
          params: {
            page,
            perPage: this.perPage
          }
        });
        if (response.status === 200) {
          this.organizations = response.data.data;
          this.totalPages = Math.ceil(response.data.total / this.perPage);
          this.currentPage = response.data.currentPage;
        } else {
          console.error('Error fetching organizations:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    },
    viewDetail(organization) {
      this.$router.push({ name: 'UsersList', params: { id: organization._id } });
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchOrganizations(this.currentPage);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchOrganizations(this.currentPage);
      }
    }
  }
};
</script>

<style scoped>
.organizationList {
  margin-bottom: 20px;
}
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
button {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
}
button:hover {
  background-color: #40a9ff;
}
.a-table th {
  background-color: #1b7bd0;
  font-weight: bold;
  padding: 10px;
  text-align: left;
}
</style>
