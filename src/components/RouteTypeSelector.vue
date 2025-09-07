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

<style scoped>
/* 경로 설정 섹션 */
.route-section {
  background-color: var(--color2);
  border-radius: 8px;
  padding: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h5 {
  margin: 0;
  color: var(--color1);
  font-family: var(--sub-font);
  font-size: 1rem;
  font-weight: bold;
}

.section-title-with-help {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.help-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--color6);
  color: white;
  border: none;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.help-icon:hover {
  background-color: #2a7a7f;
}

.route-type-toggle {
  display: flex;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: none;
}

.route-type-toggle .btn {
  flex: 1;
  text-align: center;
  border: none;
  background: transparent;
  color: var(--color1);
  font-family: var(--sub-font);
  font-size: 0.9rem;
  padding: 10px 0;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  border-radius: 0;
}

.route-type-toggle .btn.btn-primary {
  background-color: var(--color6);
  color: #fff;
  font-weight: bold;
}

.route-type-toggle .btn.btn-outline-primary {
  background-color: transparent;
  color: var(--color1);
  font-weight: normal;
}

.route-type-toggle .btn:not(:last-child) {
  border-right: 1px solid rgba(255,255,255,0.12);
}

.route-type-toggle .btn {
  min-width: 0;
  flex: 1;
  font-size: 0.85rem;
}
</style>
