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
import '@/css/favorite-register-modal.css'

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

