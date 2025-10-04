<template>
  <div v-if="isLoading" class="global-loading-overlay">
    <div class="loading-spinner"></div>
    <div class="loading-text">로딩 중...</div>
  </div>
</template>

<script>
import '@/css/global-loading-overlay.css'

export default {
  name: 'GlobalLoadingOverlay',
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    show() {
      this.isLoading = true;
    },
    hide() {
      this.isLoading = false;
    }
  }
}
</script>

