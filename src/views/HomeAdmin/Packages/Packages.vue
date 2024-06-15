<template>
	<div class="package-management">
	  <!-- Nút thêm gói -->
	  <div class="ml-auto">
		<button v-if="isLoggedIn" @click="showModalAdd" class="btnAdd">
		  Thêm gói <i class="fa-solid fa-book-open"></i>
		</button>
	  </div>
  
	  <!-- Danh sách các gói -->
	  <div class="package-list">
		<div v-for="packageItem in packages" :key="packageItem._id" class="package-card">
		  <h3><strong>{{ packageItem.TITLE }}</strong></h3>
		  <p><b>Level:</b> {{ packageItem.LEVEL }}</p>
		  <p><b>Giá:</b> {{ packageItem.COST }}</p>
		  <p><b>Số lượng sản phẩm:</b> {{ packageItem.NUMBER_OF_PRODUCT }}</p>
		  <p><b>Số lượt bình luận:</b> {{ packageItem.NUMBER_OF_COMMENT }}</p>
		  <p><b>Mô tả:</b> {{ packageItem.DESCRIPTION }}</p>
		  <p><b>Giảm giá:</b> {{ packageItem.DISCOUNT }}%</p>
		  <p><b>Thời gian:</b> {{ packageItem.MONTH }} tháng</p>
  
		  <div class="actionItem">
			<button v-if="isLoggedIn" @click="showModalUpdate(packageItem)" class="edit">
			  <i class="fa-solid fa-pen"></i> Cập nhật
			</button>
  
			<button v-if="isLoggedIn" @click="deletePackage(packageItem._id, packageItem.TITLE)" class="remove">
			  <i class="fa-solid fa-trash iconRemove"></i> Xóa
			</button>
		  </div>
		</div>
	  </div>
  
	  <!-- Modal thêm gói -->
	  <a-modal
		style="top: 40px"
		v-model:open="showAddModal"
		width="800px"
		title="Thêm gói"
		@ok="handleAddPackage"
		@cancel="handleCancel"
		okText="Thêm gói"
		cancelText="Đóng"
	  >
		<form @submit.prevent="handleAddPackage">
		  <div class="contentModal row">
			<div class="rightModal col">
			  <div class="groupForm">
				<span>Tiêu đề:</span>
				<input
				  type="text"
				  class="inputGroup"
				  v-model="newPackage.TITLE"
				  name="title"
				  placeholder="Title"
				  autocomplete="off"
				  required
				/>
			  </div>
			  <div class="groupForm">
				<span>Cấp độ:</span>
				<input
				  type="number"
				  class="inputGroup"
				  v-model="newPackage.LEVEL"
				  name="level"
				  placeholder="Level"
				  min="1"
				  autocomplete="off"
				  required
				/>
			  </div>
			  <div class="groupForm">
				<span>Giá:</span>
				<input
				  type="number"
				  class="inputGroup"
				  v-model="newPackage.COST"
				  name="cost"
				  placeholder="Cost"
				  min="0"
				  autocomplete="off"
				  required
				/>
			  </div>
			  <div class="groupForm">
				<span>Số lượng sản phẩm:</span>
				<input
				  type="number"
				  class="inputGroup"
				  v-model="newPackage.NUMBER_OF_PRODUCT"
				  name="numberOfProduct"
				  placeholder="Number of Product"
				  min="0"
				  autocomplete="off"
				  required
				/>
			  </div>
			  <div class="groupForm">
				<span>Số lượt bình luận:</span>
				<input
				  type="number"
				  class="inputGroup"
				  v-model="newPackage.NUMBER_OF_COMMENT"
				  name="numberOfComment"
				  placeholder="Number of Comment"
				  min="0"
				  autocomplete="off"
				  required
				/>
			  </div>
			  <div class="groupForm">
				<span>Mô tả:</span>
				<textarea
				  class="inputGroup"
				  v-model="newPackage.DESCRIPTION"
				  name="description"
				  placeholder="Description"
				  autocomplete="off"
				  required
				></textarea>
			  </div>
			  <div class="groupForm">
				<span>Giảm giá (%):</span>
				<input
				  type="number"
				  class="inputGroup"
				  v-model="newPackage.DISCOUNT"
				  name="discount"
				  placeholder="Discount"
				  min="0"
				  max="100"
				  autocomplete="off"
				  required
				/>
			  </div>
			  <div class="groupForm">
				<span>Thời gian (tháng):</span>
				<input
				  type="number"
				  class="inputGroup"
				  v-model="newPackage.MONTH"
				  name="month"
				  placeholder="Month"
				  min="1"
				  autocomplete="off"
				  required
				/>
			  </div>
			</div>
		  </div>
		</form>
	  </a-modal>

	  <!-- Modal xóa gói -->
	  <a-modal
		style="top: 40px; font-size: 20px;"
		v-model:open="isModalDelete"
		title="Xóa gói"
		@ok="handleOkDelete"
		@cancel="handleCancelDelete"
		:ok-button-props="okButtonProps"
		okText="Xác nhận"
		cancelText="Đóng"
		>
		<p style="font-size: 17px;">Bạn có chắc muốn xóa gói: <strong>{{ selectedTitle  }}</strong> </p>
	</a-modal>
	  <!-- Modal cập nhật gói -->
	  
	  <a-modal
		v-model:open="showEditModal"
		title="Chỉnh sửa gói"
		@ok="handleEditPackage"
		@cancel="handleCancel"
		okText="Lưu"
		cancelText="Hủy"
	>
		<form @submit.prevent="handleEditPackage">
		<div class="groupForm">
			<span>Tiêu đề:</span>
			<input
			type="text"
			class="inputGroup"
			v-model="selectedPackage.TITLE"
			name="title"
			placeholder="Tiêu đề"
			autocomplete="off"
			required
			/>
		</div>
		<div class="groupForm">
			<span>Cấp độ:</span>
			<input
			type="number"
			class="inputGroup"
			v-model="selectedPackage.LEVEL"
			name="level"
			placeholder="Cấp độ"
			min="1"
			autocomplete="off"
			required
			/>
		</div>
		<div class="groupForm">
			<span>Giá:</span>
			<input
			type="number"
			class="inputGroup"
			v-model="selectedPackage.COST"
			name="cost"
			placeholder="Giá"
			min="0"
			autocomplete="off"
			required
			/>
		</div>
		<div class="groupForm">
			<span>Số lượng sản phẩm:</span>
			<input
			type="number"
			class="inputGroup"
			v-model="selectedPackage.NUMBER_OF_PRODUCT"
			name="numberOfProduct"
			placeholder="Số lượng sản phẩm"
			min="0"
			autocomplete="off"
			required
			/>
		</div>
		<div class="groupForm">
			<span>Số lượt bình luận:</span>
			<input
			type="number"
			class="inputGroup"
			v-model="selectedPackage.NUMBER_OF_COMMENT"
			name="numberOfComment"
			placeholder="Số lượt bình luận"
			min="0"
			autocomplete="off"
			required
			/>
		</div>
		<div class="groupForm">
			<span>Mô tả:</span>
			<textarea
			class="inputGroup"
			v-model="selectedPackage.DESCRIPTION"
			name="description"
			placeholder="Mô tả"
			autocomplete="off"
			required
			></textarea>
		</div>
		<div class="groupForm">
			<span>Giảm giá (%):</span>
			<input
			type="number"
			class="inputGroup"
			v-model="selectedPackage.DISCOUNT"
			name="discount"
			placeholder="Giảm giá (%)"
			min="0"
			max="100"
			autocomplete="off"
			required
			/>
		</div>
		<div class="groupForm">
			<span>Thời gian (tháng):</span>
			<input
			type="number"
			class="inputGroup"
			v-model="selectedPackage.MONTH"
			name="month"
			placeholder="Thời gian (tháng)"
			min="1"
			autocomplete="off"
			required
			/>
		</div>
	<!-- Thêm các trường chỉnh sửa khác nếu cần -->
	</form>

</a-modal>

	</div>
  </template>
  
  
  
  <script>
import { mapState } from 'vuex';
import axiosClient from '../../../api/axiosClient';
import { message } from 'ant-design-vue';
import { useStore } from 'vuex';

export default {
  computed: {
    ...mapState(['isLoggedIn', 'packages']),
  },
  data() {
    return {
      showAddModal: false,
      showUpdateModal: false,
      selectedPackage: {},
	  showEditModal: false,
	  isModalDelete: false,
      newPackage: {
        TITLE: '',
        LEVEL: 1,
        COST: 0,
        NUMBER_OF_PRODUCT: 0,
        NUMBER_OF_COMMENT: 0,
        DESCRIPTION: '',
        MONTH: 0,
        DISCOUNT: 0,
      },
	  okButtonProps: {
        style: {
          background: "red",
        },
      },
    };
  },
  mounted() {
    this.$store.dispatch('fetchPackages');
  },
  methods: {
    showModalAdd() {
      this.showAddModal = true;
    },
    showModalUpdate(packageItem) {
      this.showEditModal  = true;
      this.selectedPackage = packageItem;
    },
	async handleEditPackage() {
		try {
			await this.$store.dispatch('updatePackage', this.selectedPackage);
			this.showEditModal = false;
		} catch (error) {
			console.error('Error updating package:', error);
			message.error('Lỗi khi cập nhật gói: ' + error.message);
		}
	},
	// handleCancelEdit () {
	// 	this.showModalUpdate = false;
	// },
    
    async handleAddPackage() {
      if (!this.newPackage.TITLE || !this.newPackage.DESCRIPTION) {
        message.error('Bạn phải nhập đủ thông tin gói.');
        return;
      }

      try {
		const response = await axiosClient.post('/package/create', this.newPackage);
		console.log('Package created:', response.data);
		if (response.data.success) {
			this.$store.dispatch('fetchPackages');
			this.resetForm();
			this.showAddModal = false;
			message.success('Thêm gói thành công!');
		} else {
		const { errors } = response.data;
		if (errors && errors.length > 0) {
			errors.forEach(error => {
			message.error(error);
			});
		} else {
			message.error('Lỗi khi thêm gói.');
			}
		}
	} catch (error) {
		console.error('Error creating package:', error);
		message.error('Lỗi khi thêm gói.');
  	}
    },
	async deletePackage(packageId, packageTitle) {
		try {
			this.selectedTitle = packageTitle;
			this.isModalDelete = true;
			this.selectedPackage = packageId;
		} catch (error) {
			console.error('Error deleting package:', error);
		}
	},
	async handleOkDelete() {
	try {
		await this.$store.dispatch('deletePackage', this.selectedPackage);
		this.isModalDelete = false;
	} catch (error) {
		console.error('Error deleting package:', error);
	}
	},

	handleCancelDelete() {
      this.isModalDelete = false;
    },
    handleCancel() {
      this.showAddModal = false;
      this.resetForm();
    },
    resetForm() {
      this.newPackage = {
        TITLE: '',
        LEVEL: 1,
        COST: 0,
        NUMBER_OF_PRODUCT: 0,
        NUMBER_OF_COMMENT: 0,
        DESCRIPTION: '',
        MONTH: 0,
        DISCOUNT: 0,
      };
    },
	
  },
};
</script>



  
  <style lang="scss" scoped>
  @import "./Packages.scss";
  </style>
  