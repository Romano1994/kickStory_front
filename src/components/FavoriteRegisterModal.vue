<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="favorite-register-modal" @click.stop>
      <div>
        <div>
          <label class="form-label">즐겨찾기 이름<span class="required-star">*</span></label>
          <input 
            type="text" 
            v-model="favoriteName" 
            placeholder="즐겨찾기 이름을 입력하세요"
            class="form-input"
            @keydown.enter="saveFavorite"
          />
        </div>
        
        <div>
          <label class="form-label">설명 (선택사항)</label>
          <textarea 
            v-model="favoriteDescription" 
            placeholder="즐겨찾기에 대한 설명을 입력하세요"
            class="form-textarea"
            rows="3"
          ></textarea>
        </div>
        
        <div>
          <label class="form-label">선택된 스토어 ({{ selectedStores.length }}개)</label>
          <div class="selected-stores-list">
            <div 
              v-for="(store, index) in selectedStores" 
              :key="store.branchCd || store.storeCd"
              class="selected-store-item"
            >
              <span class="store-order">{{ index + 1 }}</span>
              <span class="store-name">{{ store.storeKorNm }} {{ store.branchNm || '' }}</span>
            </div>
          </div>
        </div>
        
        <div class="required-guide">*은 <b>필수 입력값</b>입니다.</div>
        
        <div v-if="validationError" class="validation-error">
          {{ validationError }}
        </div>
      </div>
      
      <div>
        <button @click="closeModal">취소</button>
        <button 
          @click="saveFavorite"
          :disabled="!favoriteName.trim()"
        >
          저장
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FavoriteRegisterModal',
  props: {
    selectedStores: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close', 'save'],
  data() {
    return {
      favoriteName: '',
      favoriteDescription: '',
      validationError: ''
    }
  },
  methods: {
    closeModal() {
      this.resetForm();
      this.$emit('close');
    },
    saveFavorite() {
      this.validationError = '';
      
      if (!this.favoriteName.trim()) {
        this.validationError = '즐겨찾기 이름을 입력해주세요.';
        return;
      }
      
      // 로컬스토리지에서 기존 즐겨찾기 목록 가져오기
      const existingFavorites = JSON.parse(localStorage.getItem('favoriteCourse') || '[]');
      
      // 중복 이름 검사
      const duplicateName = existingFavorites.find(
        favorite => favorite.favoriteCourseName === this.favoriteName.trim()
      );
      
      if (duplicateName) {
        this.validationError = '동일한 즐겨찾기명이 있습니다.';
        return;
      }
      
      const favoriteData = {
        favoriteCourseName: this.favoriteName.trim(),
        description: this.favoriteDescription.trim(),
        stores: this.selectedStores,
        createdAt: new Date().toISOString()
      };
      
      // 로컬스토리지에 저장
      existingFavorites.push(favoriteData);
      localStorage.setItem('favoriteCourse', JSON.stringify(existingFavorites));
      
      this.$emit('save');
      this.resetForm();
    },
    resetForm() {
      this.favoriteName = '';
      this.favoriteDescription = '';
      this.validationError = '';
    }
  },
  mounted() {
    // 모달이 열릴 때 이름 입력 필드에 포커스

  }
}
</script>

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

.favorite-register-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(204, 195, 163);
  border-radius: 8px;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.favorite-register-modal > div:first-child {
  background-color: var(--color2);
  border-radius: 8px;
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 120px);
}

.favorite-register-modal > div:first-child > div {
  margin-bottom: 1.2rem;
  position: relative;
}

.favorite-register-modal > div:first-child > div:last-child {
  margin-bottom: 0;
}

.form-label {
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  font-family: var(--main-font);
  font-size: 0.9rem;
  font-weight: normal;
  margin-bottom: 0.2em;
  color: var(--color1);
}

.required-star {
  color: #b85c3b;
  margin-left: 2px;
  font-size: 1em;
}

.form-input {
  width: 100%;
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

.form-input:focus {
  outline: none;
  border-color: var(--color6);
  background-color: rgba(255, 255, 255, 0.15);
}

.form-input::placeholder {
  color: rgba(255, 244, 204, 0.5);
}

.form-textarea {
  width: 100%;
  padding: 8px;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: var(--color1);
  font-size: 0.9rem;
  font-family: var(--main-font);
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 80px;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--color6);
  background-color: rgba(255, 255, 255, 0.15);
}

.form-textarea::placeholder {
  color: rgba(255, 244, 204, 0.5);
}

.selected-stores-list {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 8px;
  max-height: 150px;
  overflow-y: auto;
}

.selected-store-item {
  display: flex;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.selected-store-item:last-child {
  border-bottom: none;
}

.store-order {
  background-color: var(--color6);
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  margin-right: 8px;
  flex-shrink: 0;
}

.store-name {
  color: var(--color1);
  font-size: 0.85rem;
  font-family: var(--main-font);
}

.required-guide {
  color: #b85c3b;
  font-size: 0.92rem;
  font-weight: 500;
  margin: 1.2rem 0 0.2rem 0;
  text-align: left;
}

.validation-error {
  color: #b85c3b;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0.5rem 0;
  text-align: center;
  padding: 8px;
  background-color: rgba(184, 92, 59, 0.1);
  border: 1px solid rgba(184, 92, 59, 0.3);
  border-radius: 4px;
}

.favorite-register-modal > div:last-child {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 1.5rem;
  flex-shrink: 0;
}

.favorite-register-modal button {
  padding: 8px 1.5rem;
  border: none;
  border-radius: 4px;
  font-family: var(--sub-font);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.favorite-register-modal button:first-child {
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.favorite-register-modal button:first-child:hover {
  background-color: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.7);
}

.favorite-register-modal button:last-child {
  background-color: var(--color6);
  color: white;
}

.favorite-register-modal button:last-child:hover:not(:disabled) {
  background-color: #2a7a7f;
}

.favorite-register-modal button:last-child:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

@media screen and (max-width: 720px) {
  .favorite-register-modal {
    width: 95%;
    padding: 1rem;
  }

  .favorite-register-modal > div:first-child {
    padding: 1rem;
  }

  .favorite-register-modal button {
    padding: 8px 1rem;
  }
}
</style>
