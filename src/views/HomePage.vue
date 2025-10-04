<!-- HomePage.vue -->
<template>
  <div class="main-container">
    <MainHeader></MainHeader>
    <div class="body-container">
      <MenuBar v-show="!isMobile"></MenuBar>
      <router-view v-slot="{Component}"  :key="$route.fullPath">
        <keep-alive>
          <component :is="Component"></component>
        </keep-alive>
      </router-view>
    </div>
    <MainFooter></MainFooter>
    
    <!-- 모바일 전용 Footer -->
    <div class="mobile-footer" :class="{ 'shopping-map-active': isShoppingMap }">
      <div class="mobile-footer-content">
        <h3 class="mobile-footer-title">문의 및 요청</h3>
        <a href="mailto:kickstory.user@gmail.com" class="mobile-footer-email">
          kickstory.user@gmail.com
        </a>
      </div>
    </div>
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
  data() {
    return {
      isMobile: false
    }
  },
  computed: {
    isShoppingMap() {
      const r = this.$route;
      return !!r && (r.name === 'Shopping Map' || r.path === '/');
    }
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    }
  }

}
</script>

<style>
@import '../css/main.css';
</style>