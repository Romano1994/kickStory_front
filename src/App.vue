<template>
  <div>
    <router-view></router-view>
    <GlobalLoadingOverlay ref="globalLoading" />
    <PwaInstallPrompt @show-install-guide="showInstallGuide" />
  </div>
</template>

<script>
import GlobalLoadingOverlay from './components/GlobalLoadingOverlay.vue'
import PwaInstallPrompt from './components/PwaInstallPrompt.vue'
import apiCall from './js/menu/mixins/api/api-call'

export default {
  name: 'App',
  components: {
    GlobalLoadingOverlay,
    PwaInstallPrompt
  },
  mounted() {
    // Set the global loading component reference
    apiCall.setGlobalLoadingComponent(this.$refs.globalLoading);
  },
  methods: {
    showInstallGuide() {
      // 수동 설치 안내를 위한 알림 또는 모달 표시
      alert('브라우저 메뉴에서 "홈 화면에 추가" 또는 "앱 설치" 옵션을 선택해주세요.');
    }
  }
}
</script>

<style>
</style>
