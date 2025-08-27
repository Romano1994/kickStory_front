<script>
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
            @click="$emit('confirm')"
          >
            {{ getButtonText().confirm }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.common-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(204, 195, 163);
  border-radius: 8px;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  z-index: 1001;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.modal-header {
  margin-bottom: 1rem;
  text-align: center;
}

.modal-header h3 {
  color: var(--color1);
  font-family: var(--main-font);
  font-size: 1.2rem;
  margin: 0;
}

.modal-content {
  background-color: var(--color2);
  border-radius: 8px;
  padding: 1.5rem;
}

.content-text {
  text-align: center;
  color: var(--color1);
  font-family: var(--main-font);
  font-size: 1rem;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

.modal-footer button {
  padding: 8px 1.5rem;
  border: none;
  border-radius: 4px;
  font-family: var(--sub-font);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-footer button:first-child {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color1);
}

.modal-footer button:first-child:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.modal-footer button:last-child {
  background-color: var(--color6);
  color: white;
}

.modal-footer button:last-child:hover {
  background-color: #2a7a7f;
}

.warning-button {
  background-color: #ff9800 !important;
}

.warning-button:hover {
  background-color: #f57c00 !important;
}

.delete-button {
  background-color: #f44336 !important;
}

.delete-button:hover {
  background-color: #d32f2f !important;
}

.registration-button {
  background-color: #4CAF50 !important;
}

.registration-button:hover {
  background-color: #388E3C !important;
}

@media screen and (max-width: 720px) {
  .common-modal {
    width: 95%;
    padding: 1rem;
  }
  
  .modal-content {
    padding: 1rem;
  }
  
  .modal-footer button {
    padding: 8px 1rem;
  }
}
</style> 