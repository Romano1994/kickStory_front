<script>
import AddressSearchModal from "./AddressSearchModal.vue";
import BrandRegistrationModal from "./BrandRegistrationModal.vue";
import CommonModal from "./CommonModal.vue";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Korean } from "flatpickr/dist/l10n/ko.js";

export default {
  name: "RegisterModal",
  components: {
    AddressSearchModal,
    BrandRegistrationModal,
    CommonModal,
  },
  data() {
    return {
      storeCd: "",
      storeKorNm: "",
      storeEngNm: "",
      cntry: "",
      branchNm: "",
      offlineStoreTypeCd: "00030001",
      place: "",
      website: "",
      shopDescription: "",
      contactInfo: "",
      storeSearchTimeout: null,
      storeList: [],
      addressList: [],
      showAddressModal: false,
      selectedAddress: {
        storeName: "",
        branchRoadAddr: "",
        branchAddr: "",
        lon: "",
        lat: "",
      },
      addressSearchTimeout: null,
      usualBrands: [],
      usualBrandSearch: "",
      usualBrandList: [],
      countryList: [],
      cntryCd: "",
      offlineStoreTypeList: [],
      isStoreSelect: false,
      lastSelectedStore: null,
      showBrandModal: false,
      newBrand: {
        brandNmKor: "",
        brandNmEng: "",
        brandTypeCd: "",
      },
      brandTypes: [
        { type: "한정판", typeCd: "00010001" },
        { type: "상시", typeCd: "00010002" },
      ],
      showCommonModal: false,
      commonModalMessage: "",
      commonModalType: "confirm",
      showTypeDropdown: false,
      branchTypeCd: "00050001",
      selectedBrand: null,
      selectedBrandCd: "",
      selectedBrandNmEng: "",
      selectedBrandNmKor: "",
      validationError: "",
      strtDt: "",
      endDt: "",
      feeYn: "N",
      reservationLink: "",
      description: "",
      startDatePicker: null,
      endDatePicker: null,
      showFeeDropdown: false,
    };
  },
  methods: {
    storeSearch() {
      if (this.storeSearchTimeout) {
        clearTimeout(this.storeSearchTimeout);
      }

      this.storeSearchTimeout = setTimeout(() => {
        if (
          this.lastSelectedStore &&
          this.lastSelectedStore.storeKorNm === this.storeKorNm
        ) {
          this.storeList = [];
          return;
        }

        if (this.storeKorNm.trim()) {
          this.storeEngNm = "";
          this.getApi(
            "/store/offline",
            { name: this.storeKorNm, offlineStoreTypeCd: this.offlineStoreTypeCd },
            this.storeSearchSuccess,
            this.storeSearchFail
          );
        } else {
          this.storeList = [];
        }
      }, 500);
    },
    storeSearchSuccess(res) {
      this.storeList = res.data;
    },
    storeSearchFail() {
      this.storeList = [];
    },
    selectStore(store) {
      this.lastSelectedStore = store;
      this.storeCd = store.storeCd;
      this.storeKorNm = store.storeKorNm;
      this.storeEngNm = store.storeEngNm;
      this.storeList = [];
    },
    srchCntryList() {
      this.getApi(
        "/store/country/names",
        { cntryKorNm: this.cntry },
        this.srchCntrySucc,
        this.srchCntryFail
      );
    },
    srchCntrySucc(res) {
      this.countryList = res.data;
    },
    srchCntryFail(error) {
      console.error("Country search failed:", error);
      this.countryList = [];
    },
    selectCountry(country) {
      this.cntryCd = country.isoCntryCd;
      this.cntry = country.cntryKorNm;
      this.countryList = [];
    },
    closeModal() {
      this.$emit("close");
    },
    // Address search methods
    searchAddress() {
      if (this.addressSearchTimeout) {
        clearTimeout(this.addressSearchTimeout);
      }

      this.addressSearchTimeout = setTimeout(() => {
        if (this.place.trim()) {
          this.getApi(
            `/store/address/${this.place}`,
            null,
            this.searchAddressSuccess,
            this.searchAddressFail
          );
        } else {
          this.addressList = [];
        }
      }, 500);
    },
    searchAddressSuccess(res) {
      this.addressList = res.data;
    },
    searchAddressFail(error) {
      console.error("Address search failed:", error);
    },
    handleAddressSelect(address) {
      this.selectedAddress.storeName = address.storeName;
      this.selectedAddress.branchAddr = address.address;
      this.selectedAddress.branchRoadAddr = address.roadAddress;
      this.selectedAddress.lon = address.lon;
      this.selectedAddress.lat = address.lat;
      this.place = address.roadAddress;
    },
    // Limited brands methods
    // searchLimitedBrands() {
    //   if (this.limitedBrandSearch.trim()) {
    //     this.getApi('/brand', { name: this.limitedBrandSearch }, this.searchLimitedBrandsSuccess, this.searchLimitedBrandsFail);
    //   } else {
    //     this.limitedBrandList = [];
    //   }
    // },
    // searchLimitedBrandsSuccess(res) {
    //   this.limitedBrandList = res.data;
    // },
    // searchLimitedBrandsFail(error) {
    //   console.error('Limited brands search failed:', error);
    //   this.limitedBrandList = [];
    // },
    // addLimitedBrand(brand) {
    //   if (!this.limitedBrands.some(b => b.brandNo === brand.brandNo && b.brandTypeCd===brand.brandTypeCd)) {
    //     this.limitedBrands.push({
    //       brandNo: brand.brandNo,
    //       brandNmKor: brand.brandNmKor,
    //       brandNmEng: brand.brandNmEng,
    //       brandTypeCd: brand.brandTypeCd
    //     });
    //   }
    //   this.limitedBrandSearch = '';
    //   this.limitedBrandList = [];
    // },
    // removeLimitedBrand(brand) {
    //   this.limitedBrands = this.limitedBrands.filter(b => b.brandNo !== brand.brandNo);
    // },
    showBrandRegistrationModal() {
      this.showBrandModal = true;
    },
    closeBrandModal() {
      this.showBrandModal = false;
    },
    handleBrandRegistration(brand) {
      this.addUsualBrand(brand);
    },
    searchUsualBrands() {
      if (this.usualBrandSearch.trim()) {
        this.getApi(
          "/brand",
          { name: this.usualBrandSearch },
          this.searchUsualBrandsSuccess,
          this.searchUsualBrandsFail
        );
      } else {
        this.usualBrandList = [];
      }
    },
    searchUsualBrandsSuccess(res) {
      this.usualBrandList = res.data;
    },
    searchUsualBrandsFail(error) {
      console.error("Usual brands search failed:", error);
      this.usualBrandList = [];
    },
    addUsualBrand(brand) {
      if (
        !this.usualBrands.some(
          (b) =>
            b.brandCd === brand.brandCd && b.brandTypeCd === brand.brandTypeCd
        )
      ) {
        this.usualBrands.push({
          brandCd: brand.brandCd,
          brandNmKor: brand.brandNmKor,
          brandNmEng: brand.brandNmEng,
          brandTypeCd: brand.brandTypeCd,
        });
      }
      this.usualBrandSearch = "";
      this.usualBrandList = [];
    },
    removeUsualBrand(brand) {
      this.usualBrands = this.usualBrands.filter(
        (b) => b.brandNo !== brand.brandNo
      );
    },
    addSingleBrand(brand) {
      this.selectedBrand = brand;
      this.usualBrandSearch = '';
      this.usualBrandList = [];
    },
    removeSingleBrand() {
      this.selectedBrand = null;
    },
    selectBrandForShop(brand) {
      this.selectedBrand = brand;
      this.selectedBrandCd = brand.brandCd;
      this.selectedBrandNmEng = brand.brandNmEng;
      this.selectedBrandNmKor = brand.brandNmKor;
      this.usualBrandList = [];
    },
    searchBrandsForShop() {
      if (this.selectedBrandNmKor.trim()) {
        this.getApi(
          "/brand",
          { name: this.selectedBrandNmKor },
          this.searchUsualBrandsSuccess,
          this.searchUsualBrandsFail
        );
      } else {
        this.usualBrandList = [];
      }
    },
    register() {
      if (this.offlineStoreTypeCd === "00030001") {
        if (!this.storeKorNm || !this.storeEngNm || !this.branchNm || 
            !this.selectedAddress.branchRoadAddr || !this.selectedAddress.branchAddr) {
          this.validationError = "필수 입력값을 모두 입력해주세요.";
          return;
        }
      } else if (this.offlineStoreTypeCd === "00030002") {
        if (!this.selectedBrandNmKor || !this.branchNm || 
            !this.selectedAddress.branchRoadAddr || !this.selectedAddress.branchAddr) {
          this.validationError = "필수 입력값을 모두 입력해주세요.";
          return;
        }
      } else if (this.offlineStoreTypeCd === "00030003") {
        if (!this.storeCd || !this.storeEngNm || !this.storeKorNm || !this.selectedBrandCd ||
            !this.strtDt || !this.endDt || !this.selectedAddress.branchRoadAddr || 
            !this.selectedAddress.branchAddr || !this.selectedAddress.lon || 
            !this.selectedAddress.lat) {
          this.validationError = "필수 입력값을 모두 입력해주세요.";
          return;
        }
      }
      
      this.validationError = "";

      let branchData = null;
      if (this.offlineStoreTypeCd === "00030001") {
        branchData = {
          storeCd: this.storeCd,
          storeEngNm: this.storeEngNm,
          storeKorNm: this.storeKorNm,
          branchTypeCd: this.branchTypeCd,
          offlineStoreTypeCd: this.offlineStoreTypeCd,
          branchKorNm: this.branchKorNm,
          branchCd: this.branchCd,
          cntryCd: this.cntryCd,
          branchNm: this.branchNm,
          branchRoadAddr: this.selectedAddress.branchRoadAddr,
          branchAddr: this.selectedAddress.branchAddr,
          lon: this.selectedAddress.lon,
          lat: this.selectedAddress.lat,
          shopDescription: this.shopDescription,
          contactInfo: this.contactInfo,
        };
      } else if (this.offlineStoreTypeCd === "00030002") {
        branchData = {
          offlineStoreTypeCd: this.offlineStoreTypeCd,
          branchNm: this.branchNm,
          cntryCd: this.cntryCd,
          branchTypeCd: this.branchTypeCd,
          branchRoadAddr: this.selectedAddress.branchRoadAddr,
          branchAddr: this.selectedAddress.branchAddr,
          lon: this.selectedAddress.lon,
          lat: this.selectedAddress.lat,
          shopDescription: this.shopDescription,
          contactInfo: this.contactInfo,
          brandCd: this.selectedBrandCd,
          storeCd: this.selectedBrandCd,
          storeEngNm: this.selectedBrandNmEng,
          storeKorNm: this.selectedBrandNmKor,
        };
      } else if (this.offlineStoreTypeCd === "00030003") {
        branchData = {
          storeCd: this.storeCd,
          storeEngNm: this.storeEngNm,
          storeKorNm: this.storeKorNm,
          brandCd: this.selectedBrandCd,
          strtDt: this.strtDt,
          endDt: this.endDt,
          branchRoadAddr: this.selectedAddress.branchRoadAddr,
          branchAddr: this.selectedAddress.branchAddr,
          lon: this.selectedAddress.lon,
          lat: this.selectedAddress.lat,
          feeYn: this.feeYn,
          reservationLink: this.reservationLink,
          description: this.description,
          offlineStoreTypeCd: this.offlineStoreTypeCd,
        };
      }
      
      this.postApi(
        "/store/offline-branch/registration",
        branchData,
        this.registerSuccess,
        this.registerFail
      );
    },
    registerSuccess(res) {
      this.commonModalMessage = res.data;
      this.commonModalType = "alert";
      this.showCommonModal = true;
    },
    registerFail(error) {
      this.commonModalMessage = error || "등록에 실패했습니다.";
      this.commonModalType = "alert";
      this.showCommonModal = true;
    },
    handleCommonModalConfirm() {
      this.showCommonModal = false;
      if (
        this.commonModalType === "alert" &&
        this.commonModalMessage &&
        !this.commonModalMessage.includes("실패") &&
        !this.commonModalMessage.toLowerCase().includes("fail")
      ) {
        this.closeModal();
      }
    },
    toggleTypeDropdown() {
      this.showTypeDropdown = !this.showTypeDropdown;
    },
    selectType(type) {
      this.offlineStoreTypeCd = type.commCdDtl;
      this.showTypeDropdown = false;
      this.showFeeDropdown = false; // 요금 드롭다운도 닫기
      
      // 팝업샵(00030003)을 선택했을 때 날짜 선택기 초기화
      if (type.commCdDtl === '00030003') {
        this.$nextTick(() => {
          this.initDatePickers();
        });
      } else {
        // 다른 유형을 선택했을 때 날짜 선택기 제거
        this.destroyDatePickers();
      }
    },
    handleTypeDropdownBlur(e) {
      console.log(e);
      setTimeout(() => {
        this.showTypeDropdown = false;
      }, 100);
    },
    handleFeeDropdownBlur(e) {
      console.log(e);
      setTimeout(() => {
        this.showFeeDropdown = false;
      }, 100);
    },
    fetchOfflineStoreTypeList() {
      this.getApi(
        "/comm-cd/detail",
        { commCd: "0003" },
        this.handleOfflineStoreTypeListSuccess,
        this.handleOfflineStoreTypeListFail
      );
    },
    handleOfflineStoreTypeListSuccess(res) {
      this.offlineStoreTypeList = res.data;
    },
    handleOfflineStoreTypeListFail(err) {
      console.error("오프라인 스토어 타입 목록 불러오기 실패", err);
      this.offlineStoreTypeList = [];
    },
    initDatePickers() {
      // 시작일 날짜 선택기
      this.startDatePicker = flatpickr("#startDate", {
        dateFormat: "Y-m-d",
        locale: Korean,
        allowInput: true,
        clickOpens: false,
        onChange: (selectedDates, dateStr) => {
          this.strtDt = dateStr;
        }
      });

      // 종료일 날짜 선택기
      this.endDatePicker = flatpickr("#endDate", {
        dateFormat: "Y-m-d",
        locale: Korean,
        allowInput: true,
        clickOpens: false,
        onChange: (selectedDates, dateStr) => {
          this.endDt = dateStr;
        }
      });
    },
    destroyDatePickers() {
      if (this.startDatePicker) {
        this.startDatePicker.destroy();
      }
      if (this.endDatePicker) {
        this.endDatePicker.destroy();
      }
    },
    toggleFeeDropdown() {
      this.showFeeDropdown = !this.showFeeDropdown;
    },
    selectFee(fee) {
      this.feeYn = fee;
      this.showFeeDropdown = false;
    },
  },
  mounted() {
    this.fetchOfflineStoreTypeList();
  },
  watch: {
    selectedBrandNmKor() {
      this.selectedBrand = null;
      this.selectedBrandCd = "";
      this.selectedBrandNmEng = "";
    },
    offlineStoreTypeCd() {
      // 유형이 변경될 때마다 날짜 선택기 재초기화
      this.$nextTick(() => {
        this.destroyDatePickers();
        if (this.offlineStoreTypeCd === '00030003') {
          this.initDatePickers();
        }
      });
    }
  },
  beforeUnmount() {
    if (this.addressSearchTimeout) {
      clearTimeout(this.addressSearchTimeout);
    }
    if (this.storeSearchTimeout) {
      clearTimeout(this.storeSearchTimeout);
    }
    this.destroyDatePickers();
  },
};
</script>

<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="register-modal" @click.stop>
      <div>
        <div>
          <span>유형</span>
          <div class="custom-select-wrapper" tabindex="0" @blur="handleTypeDropdownBlur">
            <div class="custom-select-selected" @click="toggleTypeDropdown">
              {{
                offlineStoreTypeList.find(
                  (t) => t.commCdDtl === offlineStoreTypeCd
                )?.commCdDtlNm || "선택"
              }}
              <span class="custom-select-arrow">▼</span>
            </div>
            <ul v-if="showTypeDropdown" class="custom-select-options">
              <li
                v-for="type in offlineStoreTypeList"
                :key="type.commCdDtl"
                :class="{ selected: type.commCdDtl === offlineStoreTypeCd }"
                @click="selectType(type)"
              >
                {{ type.commCdDtlNm }}
              </li>
            </ul>
          </div>
        </div>
        <div>
          <div v-if="['00030001','00030003'].includes(offlineStoreTypeCd)">
            <label class="form-label">
              스토어명(한글)<span class="required-star">*</span>
            </label>
            <input class="form-input" type="text" v-model="storeKorNm" @input="storeSearch" />
            <div v-if="storeList.length > 0" class="search-list">
              <div
                v-for="store in storeList"
                :key="store.storeId"
                @click="selectStore(store)"
                class="search-item"
              >
                {{ store.storeKorNm }}({{ store.storeEngNm }})
              </div>
            </div>
          </div>
        </div>
        <div>
          <div v-if="['00030001','00030003'].includes(offlineStoreTypeCd)">
            <label class="form-label">
              스토어명(영문)<span class="required-star" v-if="['00030003'].includes(offlineStoreTypeCd)">*</span>
            </label>
            <input class="form-input" type="text" v-model="storeEngNm" />
          </div>
        </div>
        <div v-if="['00030002','00030003'].includes(offlineStoreTypeCd)"> 
          <label class="form-label">브랜드명<span class="required-star">*</span></label>
         
          <input class="form-input" type="text" v-model="selectedBrandNmKor" @input="searchBrandsForShop" />
          <div v-if="usualBrandList.length > 0" class="search-list">
            <div
              v-for="brand in usualBrandList"
              :key="brand.brandCd"
              @click="selectBrandForShop(brand)"
              class="search-item"
            >
              {{ brand.brandNmKor }}
            </div>
          </div>
          <div v-else-if="selectedBrandNmKor.trim() && !selectedBrand" class="search-list">
            <div class="search-item" @click="showBrandRegistrationModal">
              등록하기
            </div>
          </div>
        </div>
        <div v-if="['00030001', '00030002'].includes(offlineStoreTypeCd)">
          <label class="form-label">
            지점명
            <span class="required-star">*</span>
          </label>
          <input class="form-input" type="text" v-model="branchNm" />
        </div>
        <div v-if="['00030001', '00030002'].includes(offlineStoreTypeCd)">
          <label class="form-label">국가</label>
          <input class="form-input" type="text" v-model="cntry" @input="srchCntryList" />
          <div v-if="countryList.length > 0" class="search-list">
            <div
              v-for="country in countryList"
              :key="country.cntryCd"
              @click="selectCountry(country)"
              class="search-item"
            >
              {{ country.cntryKorNm }}
            </div>
          </div>
        </div>
        <div v-if="['00030001', '00030002', '00030003'].includes(offlineStoreTypeCd)">
          <label class="form-label">
            주소검색<span class="required-star">*</span>
          </label>
          <div v-if="selectedAddress.branchRoadAddr" class="selected-address">
            {{ selectedAddress.branchRoadAddr }}
          </div>
          <button class="address-search-button" @click="showAddressModal = true">
            검색하기
          </button>
          <AddressSearchModal
            v-if="showAddressModal"
            @close="showAddressModal = false"
            @select="handleAddressSelect"
          />
        </div>
        
        <!-- 팝업샵(00030003) 전용 항목들 -->
        <div v-if="['00030003'].includes(offlineStoreTypeCd)">
          <label class="form-label">
            시작일<span class="required-star">*</span>
          </label>
          <div class="date-input-wrapper">
            <input 
              id="startDate" 
              class="form-input date-input" 
              type="text" 
              v-model="strtDt" 
              placeholder="YYYY-MM-DD"
              readonly
              @click="startDatePicker && startDatePicker.open()"
            />
            <span class="calendar-icon" @click="startDatePicker && startDatePicker.open()">📅</span>
          </div>
        </div>
        
        <div v-if="['00030003'].includes(offlineStoreTypeCd)">
          <label class="form-label">
            종료일<span class="required-star">*</span>
          </label>
          <div class="date-input-wrapper">
            <input 
              id="endDate" 
              class="form-input date-input" 
              type="text" 
              v-model="endDt" 
              placeholder="YYYY-MM-DD"
              readonly
              @click="endDatePicker && endDatePicker.open()"
            />
            <span class="calendar-icon" @click="endDatePicker && endDatePicker.open()">📅</span>
          </div>
        </div>
        
        <div v-if="['00030003'].includes(offlineStoreTypeCd)">
          <label class="form-label">
            요금
          </label>
          <div class="custom-select-wrapper" tabindex="0" @blur="handleFeeDropdownBlur">
            <div class="custom-select-selected" @click="toggleFeeDropdown">
              {{ feeYn === 'N' ? '무료' : '유료' }}
              <span class="custom-select-arrow">▼</span>
            </div>
            <ul v-if="showFeeDropdown" class="custom-select-options">
              <li
                :class="{ selected: feeYn === 'N' }"
                @click="selectFee('N')"
              >
                무료
              </li>
              <li
                :class="{ selected: feeYn === 'Y' }"
                @click="selectFee('Y')"
              >
                유료
              </li>
            </ul>
          </div>
        </div>
        
        <div v-if="['00030003'].includes(offlineStoreTypeCd)">
          <label class="form-label">예약 링크</label>
          <input 
            class="form-input" 
            type="text" 
            v-model="reservationLink" 
            placeholder="예약 링크를 입력하세요"
          />
        </div>
        
        <div v-if="['00030003'].includes(offlineStoreTypeCd)">
          <label class="form-label">설명</label>
          <textarea 
            class="form-textarea" 
            v-model="description" 
            placeholder="팝업샵에 대한 설명을 입력하세요"
            rows="3"
          ></textarea>
        </div>
        <div v-if="['00030001'].includes(offlineStoreTypeCd)"> 
          <label class="form-label">취급 브랜드</label>
          <input class="form-input" type="text" v-model="usualBrandSearch" @input="searchUsualBrands" />
          <div v-if="usualBrandList.length > 0" class="search-list">
            <div
              v-for="brand in usualBrandList"
              :key="brand.brandCd"
              @click="addUsualBrand(brand)"
              class="search-item"
            >
              {{ brand.brandNmKor }}
            </div>
          </div>
          <div v-else-if="usualBrandSearch.trim()" class="search-list">
            <div class="search-item" @click="showBrandRegistrationModal">
              등록하기
            </div>
          </div>
          <div class="selected-brands">
            <div
              v-for="brand in usualBrands"
              :key="brand.brandCd"
              class="selected-brand"
            >
              {{ brand.brandNmKor }}
              <span class="remove-brand" @click="removeUsualBrand(brand)">×</span>
            </div>
          </div>
        </div>
        <div>
          <label class="form-label">연락처</label>
          <input class="form-input" type="text" v-model="contactInfo" placeholder="연락처를 입력하세요" />
        </div>
        <div>
          <label class="form-label">비고</label>
          <input class="form-input" type="text" v-model="shopDescription" placeholder="비고를 입력하세요" />
        </div>
        <!-- <div v-if="branchTypeCd !== '00030001'">
          <span>웹사이트 주소 입력</span>
          <input type="text" v-model="website"/>
        </div> -->
        <!-- <div>
          <span>한정판 발매 브랜드</span>
          <input type="text" v-model="limitedBrandSearch" @input="searchLimitedBrands"/>
          <div v-if="limitedBrandList.length > 0" class="search-list">
            <div v-for="brand in limitedBrandList" 
                 :key="brand.brandNo"
                 @click="addLimitedBrand(brand)"
                 class="search-item">
              {{ brand.brandNmKor }}
            </div>
          </div>
          <div v-else-if="limitedBrandSearch.trim()" class="search-list">
            <div class="search-item" @click="showBrandRegistrationModal">
              등록하기
            </div>
          </div>
          <div class="selected-brands">
            <div v-for="brand in limitedBrands" 
                 :key="brand.brandNo"
                 class="selected-brand">
              {{ brand.brandNmKor }}
              <span class="remove-brand" @click="removeLimitedBrand(brand)">×</span>
            </div>
          </div>
        </div> -->
      </div>
      <div class="required-guide">*은 <b>필수 입력값</b>입니다.</div>
      
      <div v-if="validationError" class="validation-error">
        {{ validationError }}
      </div>

      <div>
        <button @click="closeModal">취소</button>
        <button @click="register">등록</button>
      </div>
    </div>
  </div>

  <!-- Brand Registration Modal -->
  <BrandRegistrationModal
    v-if="showBrandModal"
    :show="showBrandModal"
    :searchText="offlineStoreTypeCd === '00030002' ? selectedBrandNmKor : usualBrandSearch"
    @close="closeBrandModal"
    @register="handleBrandRegistration"
  />

  <!-- Common Modal -->
  <CommonModal
    v-if="showCommonModal"
    :show="showCommonModal"
    :content="commonModalMessage"
    :type="commonModalType"
    @confirm="handleCommonModalConfirm"
  />
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

.register-modal {
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

.register-modal > div:first-child {
  background-color: var(--color2);
  border-radius: 8px;
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 120px);
}

.register-modal > div:first-child > div {
  margin-bottom: 1.2rem;
  position: relative;
}

.register-modal > div:first-child > div:last-child {
  margin-bottom: 0;
}

.register-modal span {
  display: block;
  font-family: var(--main-font);
  font-size: 0.9rem;
  color: var(--color1);
  margin-bottom: 0.5rem;
}

.register-modal input,
.register-modal select {
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

.register-modal input:focus,
.register-modal select:focus {
  outline: none;
  border-color: var(--color6);
  background-color: rgba(255, 255, 255, 0.15);
}

.register-modal input::placeholder {
  color: rgba(255, 244, 204, 0.5);
}

.register-modal > div:last-child {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 1.5rem;
  flex-shrink: 0;
}

.register-modal button {
  padding: 8px 1.5rem;
  border: none;
  border-radius: 4px;
  font-family: var(--sub-font);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.register-modal button:first-child {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color1);
}

.register-modal button:first-child:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.register-modal button:last-child {
  background-color: var(--color6);
  color: white;
}

.register-modal button:last-child:hover {
  background-color: #2a7a7f;
}

.search-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--color2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1001;
}

.search-item {
  padding: 8px;
  cursor: pointer;
  color: var(--color1);
  font-size: 0.9rem;
  font-family: var(--main-font);
}

.search-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

@media screen and (max-width: 720px) {
  .register-modal {
    width: 95%;
    padding: 1rem;
  }

  .register-modal > div:first-child {
    padding: 1rem;
  }

  .register-modal button {
    padding: 8px 1rem;
  }
}

.selected-brands {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.selected-brand {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background-color: var(--color6);
  color: white;
  border-radius: 4px;
  font-size: 0.9rem;
}

.remove-brand {
  cursor: pointer;
  line-height: 1;
  padding: 0 6px;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  margin-left: 8px;
}

.remove-brand:hover {
  opacity: 0.8;
  transform: scale(1.1);
}

.address-search-button {
  width: 100%;
  padding: 8px;
  background-color: var(--color6);
  color: white;
  border: none;
  border-radius: 4px;
  font-family: var(--sub-font);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.address-search-button:hover {
  background-color: #2a7a7f;
}

@media screen and (max-width: 720px) {
  .address-search-button {
    padding: 8px;
  }
}

.selected-address {
  margin: 8px 0;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: var(--color1);
  font-size: 0.9rem;
  font-family: var(--main-font);
}

.register-modal select option {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color1);
  font-family: var(--main-font);
}

.custom-select-wrapper {
  position: relative;
  width: 100%;
  outline: none;
}
.custom-select-selected {
  width: 100%;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color1);
  font-size: 0.9rem;
  font-family: var(--main-font);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
}
.custom-select-arrow {
  margin-left: 8px;
  font-size: 0.8em;
}
.custom-select-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #222;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  z-index: 1002;
  margin: 0;
  padding: 0;
  list-style: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.custom-select-options li {
  padding: 8px;
  color: var(--color1);
  font-family: var(--main-font);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}
.custom-select-options li:hover {
  background-color: var(--color6);
  color: #fff;
}
.required-guide {
  color: #b85c3b;
  font-size: 0.92rem;
  font-weight: 500;
  margin: 1.2rem 0 0.2rem 0;
  text-align: left;
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
.required-star {
  color: #b85c3b;
  margin-left: 2px;
  font-size: 1em;
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

.date-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.date-input {
  padding-right: 40px;
}

.calendar-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--color6);
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
</style>
