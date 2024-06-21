<template>
    <div class="containPage">
      <h2>Lịch sử mua hàng</h2>
      <div class="contentPage">
        <div class="list-group">
          <div v-if="data.length === 0" class="orderEmpty">
            <img src="../../../public/Illustration/empty2.png" alt="" />
            <p>Đơn hàng trống</p>
          </div>
          <div
            v-for="(order, index) in data"
            :key="order._id"
            class="list-group-item list-group-item-action mt-3 rounded"
          >
            <div class="d-flex">
              <h5>Chi tiết đơn mua:</h5>
              <a-dropdown class="ml-auto" v-if="order.TrangThai === 'W'">
                <a class="ant-dropdown-link" @click.prevent>
                  <i class="fa-solid fa-ellipsis-vertical fa-lg"></i>
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a @click="showModalDelete(order)"
                        ><i class="fa-solid fa-trash" style="color: red"></i
                      ></a>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
              <a-modal
                style="top: 40px"
                v-model:open="isModalDelete"
                title="Hủy đơn mượn"
                @ok="handleOkDelete()"
                :ok-button-props="okButtonProps"
                @cancel="handleCancelDelete"
                cancelText="Đóng"
                okText="Xác nhận hủy"
              >
                <p>Bạn có chắc muốn hủy đơn mượn.</p>
              </a-modal>
            </div>
            <table class="table text-center">
              <thead>
                <tr class="table-borderless">
                  <th scope="col">STT</th>
                  <th scope="col">Tên sách</th>
                  <th scope="col">Số lượng</th>
                  <th scope="col">Đơn Giá/ngày</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ index + 1 }}</td>
                  <td>{{ order.MaSach.TenSach }}</td>
                  <td>{{ order.SoLuong }}</td>
                  <td>{{ order.MaSach.DonGia }} VND</td>
                </tr>
              </tbody>
            </table>
            <div class="d-flex">
              <div>
                <p>
                  Tổng tiền mượn:
                  <span style="color: red; font-weight: bold"
                    >{{ order.ThanhTien }} VND</span
                  >
                </p>
                <p class="d-inline">
                  Ngày mượn: {{ formatDateTime(order.NgayMuon) }}
                </p>
                <p class="d-inline ml-3" v-if="order.NgayMuon !== null">
                  Ngày trả: {{ formatDateTime(order.NgayTra) }}
                </p>
              </div>
  
              <div
                v-if="order.TrangThai === 'A'"
                class="statusOrderSuccess mr-0 mb-0"
              >
                Đã duyệt
              </div>
              <div
                v-else-if="order.TrangThai === 'D'"
                class="statusOrderDeny mr-0 mb-0"
              >
                Từ chối
              </div>
              <div v-else class="statusOrderWait mr-0 mb-0">Chưa duyệt</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import axios from "axios";
  import { toast } from "vue3-toastify";
  import moment from "moment";
  const data = ref([]);
  const ID_DG = localStorage.getItem("ID_DG");
  const fetchData = () => {
    axios
      .get("http://localhost:3000/rent/user/" + ID_DG)
      .then((res) => {
        console.log(res.data);
        data.value = res.data;
      })
      .catch((err) => console.log(err));
  };
  fetchData();
  const formatDateTime = (dateTime) => {
    return moment(dateTime).format("DD-MM-YYYY HH:mm:ss");
  };
  const isModalDelete = ref(false);
  const idOrder = ref("");
  const showModalDelete = (order) => {
    isModalDelete.value = true;
    idOrder.value = order._id;
  };
  const handleCancelDelete = () => {
    isModalDelete.value = false;
  };
  const handleOkDelete = () => {
    axios
      .delete("http://localhost:3000/rent/" + idOrder.value)
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.error);
        } else {
          handleCancelDelete();
          fetchData();
          toast.success(res.data.message);
        }
      })
      .catch((err) => console.log(err));
  };
  const okButtonProps = {
    style: {
      background: "red", // Đặt màu đỏ cho nút "OK"
    },
  };
  </script>
  
  <style lang="scss" scoped>
  @import "./History.scss";
  </style>
  