<template>
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
  </script>