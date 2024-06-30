<template>
  <div class="container-fluid">
    <div
      class="row text-white header"
      style="background-color: #2e3a59; padding: 1rem"
    >
      <div
        class="col-1 d-flex d-sm-none align-items-center justify-content-center"
      >
        <span @click="showDrawer()">X</span>
      </div>

      <div
        class="col-10 col-sm-9 d-flex align-items-center justify-content-center justify-content-sm-start"
      >
        <img
          src="../../assets/AuthHeader.png"
          alt="logo"
          height="32"
          width="34"
          class="ms-3 me-3"
        />
        <span class="d-none d-sm-flex">QUẢN TRỊ</span>
      </div>

      <div
        class="col-sm-3 d-none d-sm-flex align-items-center justify-content-sm-end"
      >
        <div v-if="isLoggedIn" class="login-button">
          <span>{{ userInfo?.USERNAME }}</span>
        </div>
        <div v-else @click="navigateToLogin" class="login-button">
          <span>Đăng Nhập</span>
        </div>
      </div>

      <div
        class="col-1 d-flex d-sm-none align-items-center justify-content-center"
      >
        <span>X</span>
      </div>
    </div>
  </div>

  <a-drawer title="MENU" v-model:open="open" placement="left">
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>
</template>

<script>
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const open = ref(false);
    const router = useRouter();
    const store = useStore();

    const isLoggedIn = computed(() => store.getters.isLoggedIn);
    const userInfo = computed(() => store.getters.userInfo);

    const showDrawer = () => {
      open.value = true;
    };

    const navigateToLogin = () => {
      router.push("/login");
    };

    return {
      open,
      showDrawer,
      isLoggedIn,
      userInfo,
      navigateToLogin,
    };
  },
});
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* Đảm bảo header nằm trên các phần tử khác */
}
.container-fluid {
  padding-top: 80px; /* Điều chỉnh phù hợp với chiều cao của header */
}

.login-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: 1px solid white;
  border-radius: 4px;
  background-color: transparent;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.login-button:hover {
  background-color: white;
  color: #2e3a59;
}
</style>
