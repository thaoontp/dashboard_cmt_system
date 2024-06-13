<template>
    <nav class="navbar bg-body-tertiary">
      <div class="container-fluid row d-flex justify-content-between">
        <div></div>
        <div>
          <h2 class="store">
            <span class="titleWeb text-info">Books</span>
            <span class="titleWeb text-dark">House</span>
          </h2>
        </div>
        <div>
          <div class="infoUser d-flex ml-auto">
            <div v-if="isUserLoggedIn()" class="contentInfo">
              <router-link to="/admin/info">
                <img :src="imageUser" class="imageUser" alt=""
              /></router-link>
              <span class="nameUser ml-1">
                {{ username }}
              </span>
              <i class="fa-solid fa-user-tie iconHeader"></i>
              <span class="nameUser mr-0 ml-1">
                {{ position }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  const isUserLoggedIn = () => {
    return localStorage.getItem("isLogin") === "true";
  };
  const username = localStorage.getItem("Username");
  const avatar = localStorage.getItem("Avatar");
  const position = localStorage.getItem("Position");
  const imageUser = `http://localhost:8082/${avatar}`;
  </script>
  
  <style lang="scss" scoped>
  @import "AppHeaderAdmin.scss";
  </style>
  