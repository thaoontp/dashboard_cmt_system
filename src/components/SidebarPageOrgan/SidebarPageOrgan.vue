<template>
  <aside :class="`${is_expanded ? 'is-expanded' : ''}`">
    <div class="logo">
      <img :src="logoURL" alt="Vue" />
      <span class="titleWeb text-info"
        >BOOKS<span class="text-dark">He</span></span
      >
    </div>

    <div class="menu-toggle-wrap">
      <button class="menu-toggle" @click="ToggleMenu">
        <span class="material-icons"
          ><i class="fa-solid fa-angles-right fa-xs"></i
        ></span>
      </button>
    </div>

    <h3>Menu</h3>
    <div class="menu">
      <router-link to="/pages/organizations" class="button">
        <span class="material-icons"
          ><i class="fa-solid fa-house icon"></i
        ></span>
        <span class="text">Home</span>
      </router-link>
      <router-link to="/pages/menu" class="button">
        <span class="material-icons"><i class="fa-solid fa-book"></i></span>
        <span class="text">Menu</span>
      </router-link>
      <router-link to="/pages/history" class="button">
        <span class="material-icons">
          <i class="fa-solid fa-clock-rotate-left"></i>
        </span>
        <span class="text">History</span>
      </router-link>
      <router-link v-if="isLoggedIn" to="/pages/profile" class="button">
        <span class="material-icons"
          ><i class="fa-solid fa-user-circle"></i
        ></span>
        <span class="text">Profile</span>
      </router-link>
      <router-link v-if="isLoggedIn" to="/pages/instructions" class="button">
        <span class="material-icons"
          ><i class="fa-solid fa-chalkboard-user"></i></span>
        <span class="text">Instructions</span>
      </router-link>
      <!-- <router-link to="/pages/registerUser" class="button">
        <span class="material-icons">
          <i class="fa-solid fa-user-plus"></i>
        </span>
        <span class="text">Register</span>
      </router-link> -->

      <!-- <router-link v-else to="/login" class="button">
        <span class="material-icons"
          ><i class="fa-solid fa-user-circle"></i
        ></span>
        <span class="text">Profile</span>
      </router-link> -->

      <router-link v-if="isAdmin" to="/" class="button">
        <span class="material-icons">
          <i class="fa-solid fa-pager"></i>
        </span>
        <span class="text">Dashboard Admin</span>
      </router-link>
    </div>
    <div class="flex"></div>
    <div class="menu" @click="showModal">
      <div class="button">
        <span class="material-icons"
          ><i class="fa-solid fa-right-from-bracket"></i
        ></span>
        <span class="text">Logout</span>
      </div>
      <a-modal
        title="Đăng xuất"
        :open="isModal"
        @ok="logout"
        @cancel="handleCancel"
        :ok-button-props="okButtonProps"
        okText="Đăng xuất"
        cancelText="Hủy"
      >
        <p>Bạn có chắc muốn đăng xuất khỏi hệ thống?</p>
      </a-modal>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex"; // Import useStore từ vuex
import logoURL from "../../assets/AuthHeader.png";

const store = useStore();

const router = useRouter();

// const isLoggedIn = localStorage.getItem("isLoginDG");
const isLoggedIn = computed(() => store.getters.isLoggedIn);
const userInfo = computed(() => store.getters.userInfo);

const isAdmin = computed(() => userInfo.value?.ROLE?.IS_ADMIN);

const is_expanded = ref(localStorage.getItem("is_expanded") === "true");

const ToggleMenu = () => {
  is_expanded.value = !is_expanded.value;
  localStorage.setItem("is_expanded", is_expanded.value);
};

// Modal andt vue
const isModal = ref(false);

const okButtonProps = {
  style: {
    background: "red", // Đặt màu đỏ cho nút "OK"
  },
};

const showModal = () => {
  isModal.value = true;
};

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};

const handleCancel = () => {
  isModal.value = false;
};
</script>

<style lang="scss" scoped>
@import "SidebarPageOrgan.scss";
</style>
