<template>
    <div class="app">
      <div class="d-block w-100">
        <AuthHeader />
        <router-view />
      </div>
    </div>
  </template>
  <script setup>
  import AuthHeader from "../../components/AuthHeader/AuthHeader.vue";
  </script>