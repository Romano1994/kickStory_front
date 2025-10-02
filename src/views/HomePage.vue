<!-- HomePage.vue -->
<template>
  <div class="main-container">
    <MainHeader></MainHeader>
    <div class="body-container">
      <MenuBar></MenuBar>
      <router-view v-slot="{Component}"  :key="$route.fullPath">
        <keep-alive>
          <component :is="Component"></component>
        </keep-alive>
      </router-view>
    </div>
    <!-- <MainFooter></MainFooter> -->
  </div>
</template>

<script>
import MainHeader from "./MainHeader.vue"
import MainFooter from "./MainFooter.vue"
import MenuBar from "@/components/MenuBar.vue";

export default {
  components: {
    MainHeader,
    MainFooter,
    MenuBar
  },
  methods: {}

}
</script>

<style>
@import '../css/main.css';
</style>