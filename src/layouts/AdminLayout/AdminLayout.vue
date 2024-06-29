<!-- <template>
    <div class="app">
      <SideBarAdmin />
      <div class="d-block w-100">
        <AppHeaderAdmin />
        <router-view />
      </div>
    </div>
  </template>
  <script setup>
  import SideBarAdmin from "../../components/SideBarAdmin/SidebaAdmin.vue";
  import AppHeaderAdmin from "../../components/AuthHeader/AuthHeader.vue";
  </script> -->

  <template>
    <div>
      <AppHeaderAdmin />
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-2 col-md-3 col-sm-4 d-none d-sm-flex">
            <a-list style="width: 100%;">
              <SideBarAdmin />
            </a-list>
          </div>
          <div class="col-lg-10 col-md-9 col-sm-8">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import SideBarAdmin from "../../components/SideBarAdmin/SidebaAdmin.vue";
  import AppHeaderAdmin from "../../components/AuthHeader/AuthHeader.vue";
  </script>

<style scoped>
.container-fluid {
  padding: 0;
}

.col-lg-2, .col-md-3, .col-sm-4 {
  padding: 0;
}

.col-lg-10, .col-md-9, .col-sm-8 {
  padding: 0;
}
</style>