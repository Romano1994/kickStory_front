<script>
export default {
  name: 'CommonInput',
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleInput(event) {
      this.$emit('input', event.target.value);
    }
  }
}
</script>

<template>
  <div class="input-container">
    <span v-if="label" class="input-label">{{ label }}</span>
    <input 
      type="text"
      :value="value"
      :placeholder="placeholder"
      @input="handleInput"
      class="common-input"
    />
  </div>
</template>

<style scoped>
.input-container {
  margin-bottom: 1.2rem;
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.input-container:last-child {
  margin-bottom: 0;
}

.input-label {
  font-family: var(--main-font);
  font-size: 0.9rem;
  color: var(--color1);
  white-space: nowrap;
  min-width: 80px;
}

.common-input {
  flex: 1;
  padding: 8px;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: var(--color1);
  font-size: 0.9rem;
  font-family: var(--main-font);
  transition: all 0.2s ease;
}

.common-input:focus {
  outline: none;
  border-color: var(--color6);
  background-color: rgba(255, 255, 255, 0.15);
}

.common-input::placeholder {
  color: rgba(255, 244, 204, 0.5);
}
</style> 