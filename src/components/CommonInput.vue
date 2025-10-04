<script>
import '@/css/common-input.css'

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
