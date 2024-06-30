<template>
  <div class="profile-container">
    <a-card class="profile-card">
      <template #title>
        <div class="profile-title">
          <label for="avatarInput">
            <a-avatar :src="avatarUrl" size="large" class="avatar"/> <!-- Hiển thị avatar nếu có -->
            <h4>{{ userInfo?.USERNAME }}</h4> <!-- Hoặc sử dụng tên đăng nhập từ userInfo -->
          </label>
          <input id="avatarInput" type="file" style="display: none;" ref="fileInput" @change="handleFileUpload">
        </div>
        
        <!-- <hr> -->
      </template>
      <a-row class="profile-info">
        <a-col :span="24">
          <div class="info-item"> 
            <p><strong>Tên đăng nhập:</strong> {{ userInfo?.USERNAME }}</p>
          </div>
          <div class="info-item">
            <p><strong>Họ và tên:</strong> {{ editing ? '' : userInfo?.FULLNAME }}</p>
            <a-input v-if="editing" v-model="editData.FULLNAME" />
          </div>
          <div class="info-item">
            <p><strong>Giới tính:</strong> {{ editing ? '' : userInfo?.GENDER }}</p>
            <a-input v-if="editing" v-model="editData.GENDER" />
          </div>
          <div class="info-item">
            <p><strong>Email:</strong> {{ editing ? '' : userInfo?.EMAIL }}</p>
            <a-input v-if="editing" v-model="editData.EMAIL" />
          </div>
          <div class="info-item">
            <p><strong>Địa chỉ:</strong> {{ editing ? '' : userInfo?.ADDRESS }}</p>
            <a-input v-if="editing" v-model="editData.ADDRESS" />
          </div>
          <!-- Thêm các thông tin khác của người dùng -->
        </a-col>
      </a-row>
      <a-button v-if="!editing" type="primary" class="edit-button" @click="editProfile">Chỉnh sửa</a-button>
      <a-button v-if="editing" type="primary" class="save-button" @click="saveProfile">Lưu</a-button>
    </a-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import axiosClient from '../../../api/axiosClient';

export default {
  data() {
    return {
      avatarUrl: null,
      editing: false, // Biến để kiểm tra trạng thái chỉnh sửa
      editData: {}, // Khởi tạo biến lưu trữ URL của avatar
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    ...mapActions(['getUserInfo']),
    editProfile() {
      // Chuyển sang chế độ chỉnh sửa
      this.editing = true;
      // Sao chép dữ liệu người dùng hiện tại vào editData để chỉnh sửa
      this.editData = { ...this.userInfo };
    },
    saveProfile() {
      // Gọi API để lưu thông tin chỉnh sửa
      this.updateUserInfo(this.editData);
      // Chuyển trở lại chế độ xem thông tin
      this.editing = false;
    },
    async updateUserInfo(updatedData) {
      try {
        const response = await axiosClient.put('/user/updateUser', updatedData);
        console.log('Cập nhật thông tin thành công:', response.data);
        // Cập nhật lại thông tin trong Vuex store nếu cần thiết
        // this.getUserInfo(); // Cập nhật lại thông tin người dùng từ server
      } catch (error) {
        console.error('Lỗi cập nhật thông tin:', error);
        // Xử lý khi cập nhật thất bại
      }
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      this.uploadAvatar(file);
    },

    async uploadAvatar(file) {
      const formData = new FormData();
      formData.append('AVATAR', file);

      try {
        const response = await axiosClient.post('/azure/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // Cập nhật URL avatar sau khi upload thành công
        this.avatarUrl = response.data.imageUrl;
        console.log('Upload thành công:', response.data);
      } catch (error) {
        console.error('Lỗi upload avatar:', error);
        // Xử lý khi upload thất bại
      }
    }
  },
  mounted() {
    if (!this.userInfo) {
      this.getUserInfo();
    }
  }
};
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.profile-card {
  width: 80%;
  margin-top: 20px;
  background-color: #70c2b4b8; /* Màu nền card */
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Đổ bóng card */
  border-radius: 8px; /* Bo tròn góc card */
  position: relative; /* Để có thể sử dụng absolute cho nút chỉnh sửa */
}

.profile-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
}

.avatar {
  margin-bottom: 10px;
}

.profile-title h2 {
  margin-bottom: 0;
  font-size: 24px;
  color: #1890ff; /* Màu sắc cho tiêu đề */
}

.profile-info {
  margin-top: 20px;
}

.info-item {
  margin-bottom: 10px;
  font-size: 16px;
  text-align: center; /* Căn giữa nội dung trong info-item */
}

.info-item p {
  margin-bottom: 5px;
  color: #333; /* Màu sắc cho nội dung thông tin */
}

.info-item strong {
  font-weight: bold;
}

.edit-button {
  position: absolute;
  /* top: 20px; */
  right: 20px;
}
.save-button {
  position: absolute;
  right: 100px; /* Để nút lưu nằm bên trái nút chỉnh sửa */
}

a-button[type="primary"] { 
  margin-top: 20px;
}
</style>

