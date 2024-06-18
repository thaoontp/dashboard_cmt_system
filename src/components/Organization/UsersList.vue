<template>
  <div class="containPage">
    <h2>Danh sách người dùng của tổ chức</h2>
    <div class="userSearch">
      <label for="userSearchInput">Tìm kiếm User:</label>
      <input type="text" id="userSearchInput" v-model="userSearchInput">
      <button class="blueButton" @click="fetchUsersByOrganizationId">Tìm kiếm</button>
    </div>
    <a-table :dataSource="users" :columns="columns" rowKey="_id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'USERNAME'">
          {{ record.USERNAME }}
        </template>
        <template v-else-if="column.dataIndex === 'FULLNAME'">
          {{ record.FULLNAME }}
        </template>
        <template v-else-if="column.dataIndex === 'IS_ACTIVATED'">
          {{ record.IS_ACTIVATED }}
        </template>
        <template v-else>
          <button class="blueButton" @click="viewDetail(record)">Xem Chi Tiết</button>
        </template>
      </template>
    </a-table>
    <div class="pagination">
      <button class="blueButton" @click="previousPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button class="blueButton" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
    <div><button class="blueButton" @click="backToOrganizations">Back to Organizations</button></div>
  </div>
</template>

<script>
import axiosClient from '../../api/axiosClient';

export default {
  name: 'UsersList',
  props: ['id'],
  data() {
    return {
      userSearchInput: '',
      users: [],
      columns: [
        { title: "User Name", dataIndex: "USERNAME", key: "USERNAME" },
        { title: "Full Name", dataIndex: "FULLNAME", key: "FULLNAME" },
        { title: "Trạng thái", dataIndex: "IS_ACTIVATED", key: "IS_ACTIVATED" },
        {
          title: "Chi tiết",
          key: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      currentPage: 1,
      totalPages: 0,
      limit: 10,
    };
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
          this.users = result.data;
          this.totalPages = result.totalPages;
          this.currentPage = result.currentPage;
        } else {
          console.error('Error fetching users:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    viewDetail(user) {
      this.$router.push({ name: 'UserDetail', params: { userId: user._id } });
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
    }
  }
};
</script>

<style scoped>
.userSearch {
  margin-bottom: 10px;
}
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
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
