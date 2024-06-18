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
      width="600px"
      title="Thêm gói"
      @ok="handleAddPackage"
      @cancel="handleCancel"
      okText="Thêm gói"
      cancelText="Đóng"
    >
      <a-form :model="newPackage" layout="vertical" ref="form"> <!-- Thiết lập layout là vertical -->
        <a-row>
          <a-col :span="24">
            <a-form-item label="Tiêu đề:" name="TITLE" :rules="[{ required: true, message: 'Vui lòng nhập tiêu đề', trigger: 'blur'}]">
              <a-input v-model="newPackage.TITLE" placeholder="Title" autocomplete="off" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item label="Level:" name="LEVEL" :rules="[{ required: true, message: 'Level này đã có, vui lòng nhập level khác', trigger: 'blur' }]">
              <a-input-number v-model="newPackage.LEVEL" :min="1" placeholder="Level" autocomplete="off" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item label="Giá:" name="COST" :rules="[{ required: true, message: 'Vui lòng nhập giá của gói', trigger: 'blur' }]">
              <a-input-number v-model="newPackage.COST" :min="0" placeholder="Cost" autocomplete="off" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item label="Số lượng sản phẩm:" name="NUMBER_OF_PRODUCT" :rules="[{ required: true, message: 'Vui lòng nhập số lượng sản phẩm', trigger: 'blur' }]">
              <a-input-number v-model="newPackage.NUMBER_OF_PRODUCT" :min="0" placeholder="Number of Product" autocomplete="off" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item label="Số lượt bình luận:" name="NUMBER_OF_COMMENT" :rules="[{ required: true, message: 'Vui lòng nhập số lượt bình luận', trigger: 'blur' }]">
              <a-input-number v-model="newPackage.NUMBER_OF_COMMENT" :min="0" placeholder="Number of Comment" autocomplete="off" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item label="Mô tả:" name="DESCRIPTION" :rules="[{ required: true, message: 'Vui lòng nhập mô tả', trigger: 'blur' }]">
              <a-textarea v-model="newPackage.DESCRIPTION" placeholder="Description" autocomplete="off" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item label="Giảm giá (%)" name="DISCOUNT" :rules="[{ required: true, message: 'Vui lòng nhập giảm giá', trigger: 'blur' }]">
              <a-input-number v-model="newPackage.DISCOUNT" :min="10" :max="50" placeholder="Discount" autocomplete="off" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <a-form-item label="Thời gian (tháng)" name="MONTH" :rules="[{ required: true, message: 'Vui lòng nhập thời gian', trigger: 'blur' }]">
              <a-input-number v-model="newPackage.MONTH" :min="1" placeholder="Month" autocomplete="off" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
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

export default {
  computed: {
    ...mapState(['isLoggedIn', 'packages', 'deletePackage']),
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
        LEVEL: null,
        COST: null,
        NUMBER_OF_PRODUCT: null,
        NUMBER_OF_COMMENT: null,
        DESCRIPTION: '',
        DISCOUNT: null,
        MONTH: null
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
      try {
        // Kiểm tra tính hợp lệ của form
        await this.$refs.form.validate();
        
        // Gửi yêu cầu tạo gói
        const response = await axiosClient.post('/package/create', this.newPackage);
        console.log('Package created:', response.data);
        if (response.data.success) {
          this.$store.dispatch('fetchPackages');
          this.resetForm();
          this.showAddModal = false;
          message.success('Thêm gói thành công!');
        } else {
          message.error('Lỗi khi thêm gói mới.');
        }
      } catch (error) {
        // Nếu form không hợp lệ, log lỗi chi tiết
        if (error.errorFields) {
          console.error('Validation failed:', error.errorFields);
        } else {
          console.error('Error creating package:', error);
          message.error('Lỗi khi thêm gói.');
        }
      }
    },
	async handleOkDelete() {
		try {
			await this.$store.dispatch('deletePackage', this.selectedPackage._id);
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
        LEVEL: null,
        COST: null,
        NUMBER_OF_PRODUCT: null,
        NUMBER_OF_COMMENT: null,
        DESCRIPTION: '',
        DISCOUNT: null,
        MONTH: null
      };
    },
	
  },
};
</script>



  
  <style lang="scss" scoped>
  @import "./Packages.scss";
  </style>
  