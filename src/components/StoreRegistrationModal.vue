<script>
import CommonModal from './CommonModal.vue'
import '../css/modal-forms.css'

export default {
  name: 'StoreRegistrationModal',
  components: {
    CommonModal
  },
  props: {
    searchText: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      store: {
        storeKorNm: '',
        storeEngNm: ''
      },
      showSuccessModal: false,
      message: '',
      isSuccess: false
    }
  },
  mounted() {
    this.initializeStoreName();
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    registerStore() {
      // Validation 체크
      if (!this.validateStoreData()) {
        return;
      }

      this.postApi('store/offline/registration', this.store, this.handleRegisterSuccess, this.handleRegisterFail);
    },
    validateStoreData() {
      // 필수 입력값 체크 (null, undefined, 빈 문자열 모두 체크)
      if (!this.store.storeKorNm || !this.store.storeEngNm || 
          this.store.storeKorNm === null || this.store.storeEngNm === null ||
          this.store.storeKorNm.trim() === '' || this.store.storeEngNm.trim() === '') {
        this.showSuccessModal = true;
        this.message = "모든 필수 항목을 입력해주세요.";
        this.isSuccess = false;
        return false;
      }

      // 스토어명(한글) validation: 한글 또는 숫자만 허용
      const koreanRegex = /^[가-힣0-9\s]+$/;
      if (!koreanRegex.test(this.store.storeKorNm.trim())) {
        this.showSuccessModal = true;
        this.message = "스토어명(한글)은 한글과 숫자만 입력 가능합니다.";
        this.isSuccess = false;
        return false;
      }

      // 스토어명(영문) validation: 영문 또는 숫자만 허용
      const englishRegex = /^[a-zA-Z0-9\s]+$/;
      if (!englishRegex.test(this.store.storeEngNm.trim())) {
        this.showSuccessModal = true;
        this.message = "스토어명(영문)은 영문과 숫자만 입력 가능합니다.";
        this.isSuccess = false;
        return false;
      }

      return true;
    },
    handleRegisterSuccess(res) {
      console.log(res.data);
      this.showSuccessModal = true;
      this.message = res.data.message;
      this.isSuccess = true;
    },
    handleRegisterFail(error) {
      this.showSuccessModal = true;
      this.message = "스토어 등록에 실패했습니다.";
      this.isSuccess = false;
      console.error('Failed to register store:', error);
    },
    closeSuccessModal() {
      this.showSuccessModal = false;
      if (this.isSuccess) {
        this.closeModal();
      }
    },

    initializeStoreName() {
      // Check if the search text contains Korean characters
      const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(this.searchText);
      if (hasKorean) {
        this.store.storeKorNm = this.searchText;
      } else {
        this.store.storeEngNm = this.searchText;
      }
    }
  }
}
</script>

<template>
  <CommonModal
    :show="show"
    title="스토어 등록"
    @close="closeModal"
  >
    <div class="modal-form-container">
             <div>
         <span class="modal-form-label">스토어명(한글)<span class="required-star">*</span></span>
         <input class="modal-form-input" type="text" v-model="store.storeKorNm"/>
       </div>
       <div>
         <span class="modal-form-label">스토어명(영문)<span class="required-star">*</span></span>
         <input class="modal-form-input" type="text" v-model="store.storeEngNm"/>
       </div>
    </div>
    <template #footer>
      <button class="modal-form-button btn-cancel" @click="closeModal">취소</button>
      <button class="modal-form-button btn-register" @click="registerStore">등록</button>
    </template>
  </CommonModal>

  <!-- Success/Error Modal -->
  <CommonModal
    :show="showSuccessModal"
    :content="message"
    :type="isSuccess ? 'alert' : 'alert'"
    @confirm="closeSuccessModal"
  />
</template>


