<!-- <template>
    <nav class="navbar">
      <div class="title">
        <div class="logo">
          <img src="../../assets/logo.png" alt="Vue" />
          <span class="titleWeb">CMTs<span class="text-dark">SYSTEM</span></span>
        </div>
      </div>
    </nav>
  </template>
  
  <style lang="scss" scoped>
  @import "AuthHeader.scss";
  </style> -->

  <template>
    <div class="containter-fuild">
      <div class="row text-white" style="background-color: #0c713d; padding: 1rem;">
        <div class="col-1 d-flex d-sm-none align-items-center justify-content-center">
          <span @click="showDrawer()">X</span>
        </div>

        <div class="col-10 col-sm-9 d-flex align-items-center justify-content-center justify-content-sm-start">
          <img src="../../assets/AuthHeader.png" alt="logo" height="32" width="34" class="ms-3 me-3">
          <span class="d-none d-sm-flex">QUẢN TRỊ</span>
        </div>

        <div class="col-sm-3 d-none d-sm-flex align-items-center justify-content-sm-end">
          <span>Admin</span>
        </div>

        <div class="col-1 d-flex d-sm-none align-items-center justify-content-center">
          <span>X</span>
        </div>
      </div>
    </div>

    <a-drawer 
    title="MENU" 
    v-model:open="open" 
    placement="left"
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-drawer>
  </template>

<script>
import { defineComponent, ref } from 'vue';
export default defineComponent ({
  setup() {
    const open = ref(false);

    const showDrawer = () => {
      open.value = true;
    };

    return {
      open,
      showDrawer,
    }
  },
})
</script>
  