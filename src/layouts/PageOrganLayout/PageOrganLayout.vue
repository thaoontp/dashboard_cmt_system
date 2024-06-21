<template>
    <div class="app">
      <SidebarPageOrgan />
      <div class="d-block w-100">
        <HeaderPageOrgan />
        <div class="scrollable"><router-view /></div>
      </div>
    </div>
</template>

<script setup>
  import SidebarPageOrgan from "../../components/SidebarPageOrgan/SidebarPageOrgan.vue";
  import HeaderPageOrgan from "../../components/HeaderPageOrgan/HeaderPageOrgan.vue";
</script>

<style scoped>
  .scrollable {
    overflow-y: auto;
    max-height: calc(100vh - 72px);
  }
</style>