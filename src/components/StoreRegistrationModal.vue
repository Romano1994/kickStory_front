<script>
import CommonModal from './CommonModal.vue'
import '../css/modal-forms.css'
import '@/css/store-registration-modal.css'

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
    },
    offlineStoreTypeCd: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      store: {
        storeKorNm: '',
        storeEngNm: '',
        offlineStoreTypeCd: ''
      },
      storeTypes: [],
      showTypeDropdown: false,
      showSuccessModal: false,
      message: '',
      isSuccess: false,
      // 브랜드 관련 데이터 추가
      brand: {
        brandNmKor: '',
        brandNmEng: '',
        brandTypeCd: ''
      },
      brandTypes: [],
      showBrandTypeDropdown: false
    }
  },
  mounted() {
    this.initializeStoreName();
    this.fetchStoreTypes();
    this.fetchBrandTypes();
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

      // 00030002일 때는 브랜드 등록 API 호출
      if (this.store.offlineStoreTypeCd === '00030002') {
        this.postApi('/brands', this.brand, this.handleRegisterSuccess, this.handleRegisterFail);
      } else {
        // 다른 유형일 때는 스토어 등록 API 호출
        this.postApi('/stores/offline', this.store, this.handleRegisterSuccess, this.handleRegisterFail);
      }
    },
    validateStoreData() {
      // 필수 입력값 체크 (null, undefined, 빈 문자열 모두 체크)
      if (!this.store.offlineStoreTypeCd ||
          this.store.offlineStoreTypeCd === null) {
        this.showSuccessModal = true;
        this.message = "스토어 유형을 선택해주세요.";
        this.isSuccess = false;
        return false;
      }
      
      // 00030002가 아닐 때만 스토어명 필수 체크
      if (this.store.offlineStoreTypeCd !== '00030002') {
        if (!this.store.storeKorNm || !this.store.storeEngNm ||
            this.store.storeKorNm === null || this.store.storeEngNm === null ||
            this.store.storeKorNm.trim() === '' || this.store.storeEngNm.trim() === '') {
          this.showSuccessModal = true;
          this.message = "모든 필수 항목을 입력해주세요.";
          this.isSuccess = false;
          return false;
        }
      }
      
      // 00030002일 때 브랜드 관련 필드들도 필수 체크
      if (this.store.offlineStoreTypeCd === '00030002') {
        if (!this.brand.brandNmKor || !this.brand.brandNmEng || !this.brand.brandTypeCd ||
            this.brand.brandNmKor === null || this.brand.brandNmEng === null || this.brand.brandTypeCd === null ||
            this.brand.brandNmKor.trim() === '' || this.brand.brandNmEng.trim() === '') {
          this.showSuccessModal = true;
          this.message = "브랜드 관련 모든 필수 항목을 입력해주세요.";
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
      }

      // 00030002가 아닐 때만 스토어명 validation 체크
      if (this.store.offlineStoreTypeCd !== '00030002') {
        // 스토어명(한글) validation: 한글(자음, 모음 포함) 또는 숫자만 허용
        const koreanRegex = /^[ㄱ-ㅎㅏ-ㅣ가-힣0-9\s]+$/;
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
      }

      return true;
    },
    handleRegisterSuccess(res) {
      this.showSuccessModal = true;
      this.message = res.data.message;
      this.isSuccess = true;
    },
    handleRegisterFail(error) {
      this.showSuccessModal = true;
      this.message = error.message || "스토어 등록에 실패했습니다.";
      this.isSuccess = false;
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
    },
    fetchStoreTypes() {
      this.getApi(
        "/common-codes/0003/details",
        null,
        this.handleStoreTypesSuccess,
        this.handleStoreTypesFail
      );
    },
    handleStoreTypesSuccess(res) {
      // 팝업샵(00030002)은 제외하고 스토어 유형 목록 설정
      this.storeTypes = res.data;
      // props로 받은 offlineStoreTypeCd가 있으면 그것을 사용, 없으면 첫 번째 유형 선택
      if (this.offlineStoreTypeCd) {
        this.store.offlineStoreTypeCd = this.offlineStoreTypeCd;
      } else if (this.storeTypes.length > 0) {
        this.store.offlineStoreTypeCd = this.storeTypes[0].commCdDtl;
      }
    },
    handleStoreTypesFail(err) {
      console.error("스토어 유형 목록 불러오기 실패", err);
      this.storeTypes = [];
    },
    toggleTypeDropdown() {
      this.showTypeDropdown = !this.showTypeDropdown;
    },
    selectType(type) {
      this.store.offlineStoreTypeCd = type.commCdDtl;
      this.showTypeDropdown = false;
    },
    handleTypeDropdownBlur(e) {
      console.log(e);
      setTimeout(() => {
        this.showTypeDropdown = false;
      }, 100);
    },
    // 브랜드 관련 메서드 추가
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
    toggleBrandTypeDropdown() {
      this.showBrandTypeDropdown = !this.showBrandTypeDropdown;
    },
    selectBrandType(type) {
      this.brand.brandTypeCd = type.commCdDtl;
      this.showBrandTypeDropdown = false;
    },
    handleBrandTypeDropdownBlur(e) {
      console.log(e);
      setTimeout(() => {
        this.showBrandTypeDropdown = false;
      }, 100);
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
        <span class="modal-form-label">스토어 유형<span class="required-star">*</span></span>
        <div class="custom-select-wrapper" tabindex="0" @blur="handleTypeDropdownBlur">
          <div class="custom-select-selected" @click="toggleTypeDropdown">
            {{
              storeTypes.find(
                (t) => t.commCdDtl === store.offlineStoreTypeCd
              )?.commCdDtlNm || "선택"
            }}
            <span class="custom-select-arrow">▼</span>
          </div>
          <ul v-if="showTypeDropdown" class="custom-select-options">
            <li
              v-for="type in storeTypes"
              :key="type.commCdDtl"
              :class="{ selected: type.commCdDtl === store.offlineStoreTypeCd }"
              @click="selectType(type)"
            >
              {{ type.commCdDtlNm }}
            </li>
          </ul>
        </div>
      </div>
      <div v-if="store.offlineStoreTypeCd !== '00030002'">
        <span class="modal-form-label">스토어명(한글)<span class="required-star">*</span></span>
        <input class="modal-form-input" type="text" v-model="store.storeKorNm"/>
      </div>
      <div v-if="store.offlineStoreTypeCd !== '00030002'">
        <span class="modal-form-label">스토어명(영문)<span class="required-star">*</span></span>
        <input class="modal-form-input" type="text" v-model="store.storeEngNm"/>
      </div>
      
      <!-- 00030002일 때 브랜드 관련 필드들 표시 -->
      <div v-if="store.offlineStoreTypeCd === '00030002'">
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
          <div class="custom-select-wrapper" tabindex="0" @blur="handleBrandTypeDropdownBlur">
            <div class="custom-select-selected" @click="toggleBrandTypeDropdown">
              {{
                brandTypes.find(
                  (t) => t.commCdDtl === brand.brandTypeCd
                )?.commCdDtlNm || "선택"
              }}
              <span class="custom-select-arrow">▼</span>
            </div>
            <ul v-if="showBrandTypeDropdown" class="custom-select-options">
              <li
                v-for="type in brandTypes"
                :key="type.commCdDtl"
                :class="{ selected: type.commCdDtl === brand.brandTypeCd }"
                @click="selectBrandType(type)"
              >
                {{ type.commCdDtlNm }}
              </li>
            </ul>
          </div>
        </div>
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

