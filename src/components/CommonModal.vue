<script>
import '@/css/common-modal.css'

export default {
  name: 'CommonModal',
  props: {
    title: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ''
    },
    htmlContent: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'confirm',
      validator: function(value) {
        return ['confirm', 'alert', 'delete', 'warning', 'registration'].indexOf(value) !== -1
      }
    },
    useInput: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits:  ['update:modelValue', 'close', 'confirm'],
  data(){
    return {
      inputValue: this.modelValue
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(val) { this.inputValue = val }
    },
    show(val) {
      if (val) this.inputValue = this.modelValue
    },
    inputValue(val) {
      this.$emit('update:modelValue', val)
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    getButtonText() {
      switch(this.type) {
        case 'alert':
          return { confirm: '확인' };
        case 'delete':
          return { cancel: '취소', confirm: '삭제' };
        case 'warning':
          return { cancel: '취소', confirm: '진행' };
        case 'registration':
          return { cancel: '취소', confirm: '등록' };
        default: // confirm
          return { cancel: '취소', confirm: '확인' };
      }
    },
    confirmAction() {
      this.$emit('confirm', this.inputValue);
    }
  }
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="common-modal" @click.stop>
      <div class="modal-header" v-if="title">
        <h3>{{ title }}</h3>
      </div>
      <div class="modal-content">
        <div v-if="htmlContent" class="content-text" v-html="htmlContent"></div>
        <div v-else-if="content" class="content-text">{{ content }}</div>
        <div v-if="useInput" class="content-text">
          <input class="form-input" type="password" v-model="inputValue"/>
        </div>
        <slot></slot>
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <template v-if="type !== 'alert'">
            <button @click="closeModal">{{ getButtonText().cancel }}</button>
          </template>
          <button 
            :class="{ 
              'warning-button': type === 'warning', 
              'delete-button': type === 'delete',
              'registration-button': type === 'registration'
            }"
            @click="confirmAction"
          >
            {{ getButtonText().confirm }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
