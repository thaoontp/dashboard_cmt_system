<template>
	<div class="package-management" v-if="isLoggedIn">
		<h2>Danh sách các gói của hệ thống</h2>

	  <!-- Danh sách các gói -->
	  <div class="package-list">
		<div v-for="packageItem in packages" :key="packageItem._id" class="package-card">
		  <h3><strong>{{ packageItem.TITLE }}</strong></h3>
		  <hr>
		  <p><b>Level:</b> {{ packageItem.LEVEL }}</p>
		  <p><b>Giá:</b> {{ formatCurrency(packageItem.COST) }} VNĐ</p>
		  <p><b>Số lượng sản phẩm:</b> {{ packageItem.NUMBER_OF_PRODUCT }}</p>
		  <p><b>Số lượt bình luận:</b> {{ packageItem.NUMBER_OF_COMMENT }}</p>
		  <p><b>Mô tả:</b> {{ packageItem.DESCRIPTION }}</p>
		  <p><b>Giảm giá:</b> {{ packageItem.DISCOUNT }}%</p>
		  <p><b>Thời gian:</b> {{ packageItem.MONTH }} tháng</p>
		  <p><b>Giá đã giảm:</b> {{ formatCurrency(calculateDiscountedPrice(packageItem.COST, packageItem.DISCOUNT)) }} VNĐ</p>

		  <div class="actionItem">
			<!-- <button v-if="isLoggedIn" @click="showModalUpdate(packageItem)" class="edit">
			  <i class="fa-solid fa-pen"></i> Cập nhật
			</button> -->

			<button v-if="isLoggedIn" @click="deletePackage(packageItem._id, packageItem.TITLE)" class="remove">
				<i class="fa-solid fa-credit-card"></i> Mua ngay
			</button>
		  </div>
		</div>
	  </div>

	  

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

	</div>
	<div v-else class="denied">
		<h3 class="text-center mt-5">Vui lòng đăng nhập để xử dụng dịch vụ</h3>
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
	levels() {
      return this.packages.map(packages => packages.LEVEL);
    },
  },
  data() {
    return {
      showAddModal: false,
	  loading: false,
      showUpdateModal: false,
      selectedPackage: {},
	  showEditModal: false,
	  isModalDelete: false,
      newPackage: {
        TITLE: "",
        LEVEL: "",
        COST: "",
        NUMBER_OF_PRODUCT: "",
        NUMBER_OF_COMMENT: "",
        DESCRIPTION: "",
        DISCOUNT: "",
        MONTH: "",
      },
	  activeInputId: null,
	  errors: {
        TITLE: "",
        LEVEL: "",
        COST: "",
        NUMBER_OF_PRODUCT: "",
        NUMBER_OF_COMMENT: "",
        DESCRIPTION: "",
        DISCOUNT: "",
        MONTH: "",
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
	calculateDiscountedPrice(originalPrice, discountPercentage) {
      const discount = parseFloat(discountPercentage) / 100;
      const discountedPrice = originalPrice * (1 - discount);
      return discountedPrice.toFixed(2); // Làm tròn đến 2 chữ số sau dấu thập phân
    },

	formatCurrency(value) {
      // Chuyển đổi số sang chuỗi và thêm dấu phân tách hàng nghìn
      const formattedValue = parseFloat(value).toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$&.');
      return formattedValue;
    },

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
			this.loading = true;
		} catch (error) {
			console.error('Error updating package:', error);
			message.error('Lỗi khi cập nhật gói: ' + error.message);
			this.loading = false;
		}
	},
	// handleCancelEdit () {
	// 	this.showModalUpdate = false;
	// },

	handleValidate(field) {
		const { TITLE, LEVEL, COST, NUMBER_OF_PRODUCT, NUMBER_OF_COMMENT, DESCRIPTION, DISCOUNT, MONTH } = this.newPackage;

		switch (field) {
			case 'TITLE':
				this.errors.TITLE = TITLE.trim() ? '' : 'Vui lòng nhập tiêu đề';
				break;
			case 'LEVEL':
				// Kiểm tra xem level có hợp lệ không
				const isValidLevel = LEVEL > 0;
				// Kiểm tra xem level đã tồn tại trong danh sách levels không
				const isDuplicateLevel = this.levels.includes(parseInt(this.newPackage.LEVEL));

				// Thiết lập thông báo lỗi dựa trên điều kiện
				if (!isValidLevel) {
					this.errors.LEVEL = 'Vui lòng nhập level';
				} else if (isDuplicateLevel) {
					this.errors.LEVEL = 'Level đã tồn tại';
				} else {
					this.errors.LEVEL = ''; // Thiết lập thành rỗng nếu không có lỗi
				}
				break;
			case 'COST':
				this.errors.COST = COST > 0 ? '' : 'Giá phải lớn hơn 0';
				break;
			case 'NUMBER_OF_PRODUCT':
				this.errors.NUMBER_OF_PRODUCT = NUMBER_OF_PRODUCT > 0 ? '' : 'Vui lòng nhập số lượng sản phẩm';
				break;
			case 'NUMBER_OF_COMMENT':
				this.errors.NUMBER_OF_COMMENT = NUMBER_OF_COMMENT > 0 ? '' : 'Vui lòng nhập số lượt bình luận';
				break;
			case 'DESCRIPTION':
				this.errors.DESCRIPTION = DESCRIPTION.trim() ? '' : 'Vui lòng nhập mô tả';
				break;
			case 'DISCOUNT':
				this.errors.DISCOUNT = (DISCOUNT >= 10 && DISCOUNT <= 50) ? '' : 'Giảm giá phải trong khoảng từ 10 đến 50';
				break;
			case 'MONTH':
				this.errors.MONTH = (MONTH >= 1 && MONTH <= 36) ? '' : 'Thời gian phải từ 1 đến 36 tháng';
				break;
			default:
				break;
		}
	},

    
    async handleAddPackage() {
		for (const field in this.newPackage) {
			this.handleValidate(field);
		}

		// Kiểm tra xem có lỗi không
		if (Object.values(this.errors).some(error => error)) {
		console.log(this.errors);
		return;
		}
		this.loading = true;
      try {
		const response = await axiosClient.post('/package/create', this.newPackage);
		console.log('Package created:', response.data);
		if (response.data.success) {
			this.$store.dispatch('fetchPackages');
			this.resetForm();
			this.showAddModal = false;
			this.loading = false;
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
		this.loading = false;
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
  @import "./Menu.scss";
  </style>