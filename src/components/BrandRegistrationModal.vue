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
      this.postApi('/brand/registration', this.brand, this.handleRegisterSuccess, this.handleRegisterFail);
    },
    handleRegisterSuccess(res) {
      console.log(res.data);
      this.showSuccessModal = true;
      this.message = res.data.message;
      this.isSuccess = true;
    },
    handleRegisterFail(error) {
      this.showSuccessModal = true;
      this.message = error;
      this.isSuccess = false;
      console.error('Failed to register brand:', error);
    },
    closeSuccessModal() {
      this.showSuccessModal = false;
      if (this.isSuccess) {
        this.closeModal();
      }
    },
    fetchBrandTypes() {
      this.getApi('/comm-cd/detail', { commCd: '0002' }, this.handleBrandTypesSuccess, this.handleBrandTypesFail);
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
        <span class="modal-form-label">브랜드(한글)</span>
        <input class="modal-form-input" type="text" v-model="brand.brandNmKor"/>
      </div>
      <div>
        <span class="modal-form-label">브랜드(영문)</span>
        <input class="modal-form-input" type="text" v-model="brand.brandNmEng"/>
      </div>
      <div>
        <span class="modal-form-label">브랜드 종류</span>
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

 