<template>
    <nav class="navbar bg-body-tertiary">
      <div class="container-fluid row d-flex justify-content-between">
        <div></div>
        <div>
          <h2 class="store">
            <span class="titleWeb text-info">Comments</span>
            <span class="titleWeb text-dark">System</span>
          </h2>
        </div>
        <div>
          <div v-if="isLoggedIn()" class="contentInfo pb-2">
            <img :src="imageUser" class="imageUser" alt="noImage"/>
            <span class="nameUser">{{ username }}</span>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  const isLoggedIn = () => {
    return localStorage.getItem("isLoginDG") === "true";
  };
  const username = localStorage.getItem("TenDG");
  const avatar = localStorage.getItem("AvatarDG");
  const imageUser = `http://localhost:3000/${avatar}`;
  </script>
  
  <style lang="scss" scoped>
  @import "HeaderPageOrgan.scss";
  </style>
  