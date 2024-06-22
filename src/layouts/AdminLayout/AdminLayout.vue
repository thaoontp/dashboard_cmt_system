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
    <AppHeaderAdmin />

    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-2 d-none d-sm-flex">
          <a-list style="width: 100%;" >
            <SideBarAdmin />
            <!-- <template #header>
              <div style="font-size: 20px;">MENU</div>
            </template> -->
          </a-list>
        </div>
        <!-- <div class="col-sm-2">
            <SideBarAdmin />
        </div> -->

        <div class="col-10 col-sm-10">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import SideBarAdmin from "../../components/SideBarAdmin/SidebaAdmin.vue";
  import AppHeaderAdmin from "../../components/AuthHeader/AuthHeader.vue";
  </script>