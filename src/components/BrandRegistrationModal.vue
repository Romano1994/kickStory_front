<script>
import CommonModal from './CommonModal.vue'

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
    <div>
      <div>
        <span>브랜드(한글)</span>
        <input type="text" v-model="brand.brandNmKor"/>
      </div>
      <div>
        <span>브랜드(영문)</span>
        <input type="text" v-model="brand.brandNmEng"/>
      </div>
      <div>
        <span>브랜드 종류</span>
        <select v-model="brand.brandTypeCd" class="brand-type-select">
          <option v-for="type in brandTypes" 
                  :key="type.commCdDtl" 
                  :value="type.commCdDtl">
            {{ type.commCdDtlNm }}
          </option>
        </select>
      </div>
    </div>
    <template #footer>
      <button @click="closeModal">취소</button>
      <button @click="registerBrand">등록</button>
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

<style scoped>
div > div {
  margin-bottom: 1.2rem;
  position: relative;
}

div > div:last-child {
  margin-bottom: 0;
}

span {
  display: block;
  font-family: var(--main-font);
  font-size: 0.9rem;
  color: var(--color1);
  margin-bottom: 0.5rem;
}

input,
select {
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

input:focus,
select:focus {
  outline: none;
  border-color: var(--color6);
  background-color: rgba(255, 255, 255, 0.15);
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  padding-right: 32px;
}

select option {
  background-color: var(--color2);
  color: var(--color1);
}
</style> 