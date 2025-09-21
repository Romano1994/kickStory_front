<template>
  <div v-if="isLoading" class="global-loading-overlay">
    <div class="loading-spinner"></div>
    <div class="loading-text">로딩 중...</div>
  </div>
</template>

<script>
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

<style scoped>
.global-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(141, 141, 141, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

.loading-text {
  color: #333;
  font-size: 16px;
  font-weight: bold;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
