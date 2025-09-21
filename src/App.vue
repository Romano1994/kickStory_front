<template>
  <div>
    <router-view></router-view>
    <GlobalLoadingOverlay ref="globalLoading" />
  </div>
</template>

<script>
import GlobalLoadingOverlay from './components/GlobalLoadingOverlay.vue'
import apiCall from './js/menu/mixins/api/api-call'

export default {
  name: 'App',
  components: {
    GlobalLoadingOverlay
  },
  mounted() {
    // Set the global loading component reference
    apiCall.setGlobalLoadingComponent(this.$refs.globalLoading);
  }
}
</script>

<style>
</style>
