<script>
import CommonModal from './CommonModal.vue'
import '../css/modal-forms.css'

export default {
  name: 'BrandRegistrationModal',
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
      brand: {
        brandNmKor: '',
        brandNmEng: '',
        brandTypeCd: ''
      },
      brandTypes: [],
      showSuccessModal: false,
      message: '',
      isSuccess: false
    }
  },
  mounted() {
    this.fetchBrandTypes();
    this.initializeBrandName();
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    registerBrand() {
      // Validation 체크
      if (!this.validateBrandData()) {
        return;
      }

      this.postApi('/brands', this.brand, this.handleRegisterSuccess, this.handleRegisterFail);
    },
    handleRegisterSuccess(res) {
      this.showSuccessModal = true;
      this.message = res.data.message;
      this.isSuccess = true;
    },
    validateBrandData() {
      // 필수 입력값 체크 (null, undefined, 빈 문자열 모두 체크)
      if (!this.brand.brandNmKor || !this.brand.brandNmEng || !this.brand.brandTypeCd ||
          this.brand.brandNmKor === null || this.brand.brandNmEng === null || this.brand.brandTypeCd === null ||
          this.brand.brandNmKor.trim() === '' || this.brand.brandNmEng.trim() === '') {
        this.showSuccessModal = true;
        this.message = "모든 필수 항목을 입력해주세요.";
        this.isSuccess = false;
        return false;
      }
      
      // 브랜드명(한글) validation: 한글(자음, 모음 포함) 또는 숫자만 허용
      const koreanRegex = /^[ㄱ-ㅎㅏ-ㅣ가-힣0-9\s]+$/;
      if (!koreanRegex.test(this.brand.brandNmKor.trim())) {
        this.showSuccessModal = true;
        this.message = "브랜드명(한글)은 한글과 숫자만 입력 가능합니다.";
        this.isSuccess = false;
        return false;
      }
      
      // 브랜드명(영문) validation: 영문 또는 숫자만 허용
      const englishRegex = /^[a-zA-Z0-9\s]+$/;
      if (!englishRegex.test(this.brand.brandNmEng.trim())) {
        this.showSuccessModal = true;
        this.message = "브랜드명(영문)은 영문과 숫자만 입력 가능합니다.";
        this.isSuccess = false;
        return false;
      }

      return true;
    },
    handleRegisterFail(error) {
      this.showSuccessModal = true;
      this.message = error.message || "브랜드 등록에 실패했습니다.";
      this.isSuccess = false;
    },
    closeSuccessModal() {
      this.showSuccessModal = false;
      if (this.isSuccess) {
        this.closeModal();
      }
    },
    fetchBrandTypes() {
      this.getApi('/common-codes/0002/details', null, this.handleBrandTypesSuccess, this.handleBrandTypesFail);
    },
    handleBrandTypesSuccess(res) {
      this.brandTypes = res.data;
      if (this.brandTypes.length > 0) {
        this.brand.brandTypeCd = this.brandTypes[0].commCdDtl;
      }
    },
    handleBrandTypesFail(error) {
      console.error('Failed to fetch brand types:', error);
    },
    initializeBrandName() {
      // Check if the search text contains Korean characters
      const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(this.searchText);
      if (hasKorean) {
        this.brand.brandNmKor = this.searchText;
      } else {
        this.brand.brandNmEng = this.searchText;
      }
    }
  }
}
</script>

<template>
  <CommonModal
      :show="show"
      title="브랜드 등록"
      @close="closeModal"
  >
    <div class="modal-form-container">
      <div>
        <span class="modal-form-label">브랜드(한글)<span class="required-star">*</span></span>
        <input class="modal-form-input" type="text" v-model="brand.brandNmKor"/>
      </div>
      <div>
        <span class="modal-form-label">브랜드(영문)<span class="required-star">*</span></span>
        <input class="modal-form-input" type="text" v-model="brand.brandNmEng"/>
      </div>
      <div>
        <span class="modal-form-label">브랜드 종류<span class="required-star">*</span></span>
        <select class="modal-form-select" v-model="brand.brandTypeCd">
          <option v-for="type in brandTypes"
                  :key="type.commCdDtl"
                  :value="type.commCdDtl">
            {{ type.commCdDtlNm }}
          </option>
        </select>
      </div>
    </div>
    <template #footer>
      <button class="modal-form-button btn-cancel" @click="closeModal">취소</button>
      <button class="modal-form-button btn-register" @click="registerBrand">등록</button>
    </template>
  </CommonModal>
  <CommonModal
      :show="showSuccessModal"
      :content="message"
      type="alert"
      @close="closeSuccessModal"
      @confirm="closeSuccessModal"
  />
</template>

 