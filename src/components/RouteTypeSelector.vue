<template>
  <div class="route-section">
    <div class="section-header">
      <div class="section-title-with-help">
        <h5>경로 검색 방식</h5>
        <button class="help-icon" @click="$emit('show-help')" title="경로 검색 방식 도움말">
          ?
        </button>
      </div>
    </div>
    <div class="btn-group route-type-toggle" role="group" aria-label="Route Type Toggle">
      <button
        type="button"
        class="btn"
        :class="selectedType === 'optimal' ? 'btn-primary' : 'btn-outline-primary'"
        @click="selectType('optimal')"
      >최적경로</button>
      <button
        type="button"
        class="btn"
        :class="selectedType === 'fixed' ? 'btn-primary' : 'btn-outline-primary'"
        @click="selectType('fixed')"
      >도착지 고정</button>
      <button
        type="button"
        class="btn"
        :class="selectedType === 'sequential' ? 'btn-primary' : 'btn-outline-primary'"
        @click="selectType('sequential')"
      >순차 검색</button>
    </div>
  </div>
</template>

<script>
import '@/css/route-type-selector.css'

export default {
  name: 'RouteTypeSelector',
  props: {
    selectedType: {
      type: String,
      default: 'optimal',
      validator: (value) => ['optimal', 'fixed', 'sequential'].includes(value)
    }
  },
  emits: ['type-change', 'show-help'],
  methods: {
    selectType(type) {
      this.$emit('type-change', type);
    }
  }
}
</script>

