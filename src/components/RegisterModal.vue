<script>
import AddressSearchModal from "./AddressSearchModal.vue";
import BrandRegistrationModal from "./BrandRegistrationModal.vue";
import CommonModal from "./CommonModal.vue";
import StoreRegistrationModal from "./StoreRegistrationModal.vue";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import {Korean} from "flatpickr/dist/l10n/ko.js";

export default {
  name: "RegisterModal",
  components: {
    AddressSearchModal,
    BrandRegistrationModal,
    CommonModal,
    StoreRegistrationModal,
  },
  props: {
    initialOfflineStoreType: {
      type: String
    }
  },
  data() {
    return {
      isUpdatingFromSelectBrand: false,
      isUpdatingFromSelectStore: false,
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
      searchBrandList: [],
      isSearchBrandList: false,
      countryList: [],
      cntryCd: "KR",
      offlineStoreTypeList: [],
      isStoreSelect: false,
      isSearchStoreList: false,
      hasSearchedStore: false,
      hasSearchedBrand: false,
      lastSelectedStore: null,
      showBrandModal: false,
      newBrand: {
        brandNmKor: "",
        brandNmEng: "",
        brandTypeCd: "",
      },
      brandTypes: [
        {type: "한정판", typeCd: "00010001"},
        {type: "상시", typeCd: "00010002"},
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
      showStoreModal: false,
    };
  },
  methods: {
    storeSearch() {
      this.isSearchStoreList = true;

      this.storeSearchTimeout = setTimeout(() => {
        if (
            this.lastSelectedStore &&
            this.lastSelectedStore.storeKorNm === this.storeKorNm
        ) {
          this.storeList = [];
          return;
        }

        if (this.storeKorNm.trim()) {
          this.hasSearchedStore = true;
          this.storeEngNm = "";
          this.getApi(
              "/store/offline",
              {name: this.storeKorNm, offlineStoreTypeCd: this.offlineStoreTypeCd},
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
      this.isUpdatingFromSelectStore = true;
      this.storeCd = store.storeCd;
      this.storeKorNm = store.storeKorNm;
      this.storeEngNm = store.storeEngNm;
      this.storeList = [];
      this.$nextTick(() => {
        this.isUpdatingFromSelectStore = false;
      });
      this.isSearchStoreList = false;
    },
    srchCntryList() {
      this.getApi(
          "/store/country/names",
          {cntryKorNm: this.cntry},
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
      this.searchBrandsForShop();
    },
    handleBrandRegistration(brand) {
      this.addUsualBrand(brand);
    },
    searchUsualBrands() {
      if (this.usualBrandSearch.trim()) {
        this.getApi(
            "/brand",
            {name: this.usualBrandSearch},
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
      this.isUpdatingFromSelectBrand = true;
      this.selectedBrand = brand;
      this.selectedBrandNmKor = brand.brandNmKor;
      this.selectedBrandCd = brand.brandCd;
      this.selectedBrandNmEng = brand.brandNmEng;
      this.searchBrandList = [];
      this.isSearchBrandList = false;
      // Reset the flag after the current tick to ensure it doesn't affect other operations
      this.$nextTick(() => {
        this.isUpdatingFromSelectBrand = false;
      });
    },
    searchBrandsForShop() {
      this.isSearchBrandList = true;
      if (this.selectedBrandNmKor.trim()) {
        this.hasSearchedBrand = true;
        this.getApi(
            "/brand",
            {name: this.selectedBrandNmKor},
            this.searchBrandsForShopSuccess,
            this.searchBrandsForShopFail
        );
      } else {
        this.searchBrandList = [];
      }
    },
    searchBrandsForShopSuccess(res) {
      this.searchBrandList = res.data;
    },
    searchBrandsForShopFail(error) {
      console.error("Brand search failed:", error);
      this.searchBrandList = [];
    },
    async register() {
      // 추가 유효성 검사: 검색 기능 실행 여부 확인
      if (this.offlineStoreTypeCd === "00030001") {
        if (!this.hasSearchedStore) {
          this.validationError = "스토어 검색을 먼저 실행해주세요.";
          return;
        }
      } else if (this.offlineStoreTypeCd === "00030002") {
        if (!this.hasSearchedBrand) {
          this.validationError = "브랜드 검색을 먼저 실행해주세요.";
          return;
        }
      } else if (this.offlineStoreTypeCd === "00030003") {
        if (!this.hasSearchedStore || !this.hasSearchedBrand) {
          this.validationError = "스토어와 브랜드 검색을 먼저 실행해주세요.";
          return;
        }
      }

      if (this.offlineStoreTypeCd === "00030001") {

        if (!this.storeKorNm || !this.storeEngNm || !this.storeCd) {
          this.validationError = "등록된 스토어가 아니거나 스토어가 올바르게 선택이 되지 않았습니다.";
          return;
        }
        if (!this.branchNm) {
          this.validationError = "지점명을 입력해주세요.";
          return;
        }

      } else if (this.offlineStoreTypeCd === "00030002") {
        if (!this.selectedBrandNmKor || !this.selectedBrandCd || !this.selectedBrandNmEng) {
          this.validationError = "등록된 브랜드가 아니거나 브랜드가 올바르게 선택되지 않았습니다.";
          return;
        }
        if (!this.branchNm) {
          this.validationError = "지점명을 입력해주세요.";
          return;
        }
      } else if (this.offlineStoreTypeCd === "00030003") {
        if (!this.storeCd || !this.storeEngNm || !this.storeKorNm || !this.selectedBrandCd ||
            !this.strtDt || !this.endDt || !this.selectedAddress.lon ||
            !this.selectedAddress.lat) {
          this.validationError = "필수 입력값을 모두 입력해주세요.";
          return;
        }
      }
      if (!this.selectedAddress.branchRoadAddr || !this.selectedAddress.branchAddr) {
        this.validationError = "주소를 입력해주세요.";
        return;
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
          cntryCd: "KR",
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
          cntryCd: "KR",
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
          popupRoadAddr: this.selectedAddress.branchRoadAddr,
          popupAddr: this.selectedAddress.branchAddr,
          cntryCd: "KR",
          lon: this.selectedAddress.lon,
          lat: this.selectedAddress.lat,
          feeYn: this.feeYn,
          reservationLink: this.reservationLink,
          description: this.description,
          offlineStoreTypeCd: this.offlineStoreTypeCd,
          shopDescription: this.shopDescription,
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
      console.log("error", error)
      this.commonModalMessage = error.message;
      this.commonModalType = "alert";
      this.showCommonModal = true;
    },
    handleCommonModalConfirm() {
      this.showCommonModal = false;
      if (
          this.commonModalType === "alert" &&
          this.commonModalMessage &&
          !this.commonModalMessage.includes("실패") &&
          !this.commonModalMessage.includes("오류") &&
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

      // 모든 변수 초기화
      this.storeCd = "";
      this.storeKorNm = "";
      this.storeEngNm = "";
      this.cntry = "";
      this.branchNm = "";
      this.place = "";
      this.website = "";
      this.shopDescription = "";
      this.contactInfo = "";
      this.storeList = [];
      this.addressList = [];
      this.selectedAddress = {
        storeName: "",
        branchRoadAddr: "",
        branchAddr: "",
        lon: "",
        lat: "",
      };
      this.usualBrands = [];
      this.usualBrandSearch = "";
      this.usualBrandList = [];
      this.countryList = [];
      this.cntryCd = "";
      this.isStoreSelect = false;
      this.lastSelectedStore = null;
      this.selectedBrand = null;
      this.selectedBrandCd = "";
      this.selectedBrandNmEng = "";
      this.selectedBrandNmKor = "";
      this.validationError = "";
      this.strtDt = "";
      this.endDt = "";
      this.feeYn = "N";
      this.reservationLink = "";
      this.description = "";
      this.hasSearchedStore = false;
      this.hasSearchedBrand = false;

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
    handleTypeDropdownBlur() {
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
          {commCd: "0003"},
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
    showStoreRegistrationModal() {
      this.showStoreModal = true;
    },
    closeStoreModal() {
      this.showStoreModal = false;
      this.storeSearch();
    },
    handleStoreRegistration(result) {
      this.closeStoreModal();

      if (result.success) {
        // 스토어 등록 성공 시 CommonModal로 성공 메시지 표시
        this.commonModalMessage = result.message;
        this.commonModalType = "alert";
        this.showCommonModal = true;

        // 성공적으로 등록된 스토어 정보를 현재 입력 필드에 설정
        if (result.data) {
          this.storeCd = result.data.storeCd;
          this.storeKorNm = result.data.storeKorNm;
          this.storeEngNm = result.data.storeEngNm;
        }
      } else {
        // 스토어 등록 실패 시 CommonModal로 실패 메시지 표시
        this.commonModalMessage = result.message;
        this.commonModalType = "alert";
        this.showCommonModal = true;
      }
    },
  },
  mounted() {
    this.fetchOfflineStoreTypeList();
    this.offlineStoreTypeCd = this.initialOfflineStoreType;
  },
  watch: {
    selectedBrandNmKor() {
      // Only reset if not updating from selectBrandForShop
      if (!this.isUpdatingFromSelectBrand) {
        this.selectedBrand = null;
        this.selectedBrandCd = "";
        this.selectedBrandNmEng = "";
        this.searchBrandList = [];
        this.isSearchBrandList = false;
      }
    },
    storeKorNm() {
      // Only reset if not updating from selectStore
      if (!this.isUpdatingFromSelectStore) {
        this.storeCd = "";
        this.storeEngNm = "";
        this.storeList = [];
      }
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
        <div v-if="['00030002','00030003'].includes(offlineStoreTypeCd)">
          <label class="form-label">브랜드명<span class="required-star">*</span></label>
          <div class="brand-search-container">
            <input class="form-input brand-search-input" type="text" v-model="selectedBrandNmKor"
                   @keyup.enter="searchBrandsForShop" placeholder="브랜드명을 입력하세요"/>
            <button class="search-button" @click="searchBrandsForShop">검색</button>
          </div>
          <div v-if="isSearchBrandList" class="search-list">
            <div
                v-for="brand in searchBrandList"
                :key="brand.brandCd"
                @click="selectBrandForShop(brand)"
                class="search-item"
            >
              {{ brand.brandNmKor }}({{ brand.brandNmEng }})
            </div>
            <div class="search-item" @click="showBrandRegistrationModal">
              등록하기
            </div>
          </div>
        </div>

        <div v-if="['00030002'].includes(offlineStoreTypeCd)">
          <label class="form-label">
            브랜드명(영어)<span class="required-star">*</span>
          </label>
          <input class="form-input" type="text" v-model="selectedBrandNmEng" placeholder="영어 브랜드명을 입력하세요"/>
        </div>

        <div>
          <div v-if="['00030001','00030003'].includes(offlineStoreTypeCd)">
            <label class="form-label">
              {{ offlineStoreTypeCd === '00030001' ? '스토어명(한글)' : '스토어명' }}<span class="required-star">*</span>
            </label>
            <div class="brand-search-container">
              <input class="form-input brand-search-input" type="text" v-model="storeKorNm" @keyup.enter="storeSearch"
                     placeholder="스토어명을 입력하세요"/>
              <button class="search-button" @click="storeSearch">검색</button>
            </div>
            <div v-if="isSearchStoreList" class="search-list">
              <div
                  v-for="store in storeList"
                  :key="store.storeId"
                  @click="selectStore(store)"
                  class="search-item"
              >
                {{ store.storeKorNm }}({{ store.storeEngNm }})
              </div>
              <div class="search-item" @click="showStoreRegistrationModal">
                등록하기
              </div>
            </div>
          </div>
        </div>
        <div v-if="offlineStoreTypeCd === '00030001'">
          <label class="form-label">
            스토어명(영어)<span class="required-star">*</span>
          </label>
          <input class="form-input" type="text" v-model="storeEngNm" placeholder="영어 스토어명을 입력하세요"/>
        </div>
        <div v-if="['00030001', '00030002'].includes(offlineStoreTypeCd)">
          <label class="form-label">
            지점명
            <span class="required-star">*</span>
          </label>
          <input class="form-input" type="text" v-model="branchNm" placeholder="지점명을 입력하세요"/>
        </div>
        <!-- <div v-if="['00030001', '00030002'].includes(offlineStoreTypeCd)">
          <label class="form-label">국가</label>
          <input class="form-input" type="text" v-model="cntry" @input="srchCntryList" placeholder="국가명을 입력하세요" />
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
        </div> -->
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
                autocomplete="off"
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
                autocomplete="off"
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
        <!--        <div v-if="['00030001'].includes(offlineStoreTypeCd)">-->
        <!--          <label class="form-label">취급 브랜드</label>-->
        <!--          <input class="form-input" type="text" v-model="usualBrandSearch" @input="searchUsualBrands"-->
        <!--                 placeholder="취급 브랜드명을 입력하세요"/>-->
        <!--          <div v-if="usualBrandList.length > 0" class="search-list">-->
        <!--            <div-->
        <!--                v-for="brand in usualBrandList"-->
        <!--                :key="brand.brandCd"-->
        <!--                @click="addUsualBrand(brand)"-->
        <!--                class="search-item"-->
        <!--            >-->
        <!--              {{ brand.brandNmKor }}-->
        <!--            </div>-->
        <!--          </div>-->
        <!--          <div v-else-if="usualBrandSearch.trim()" class="search-list">-->
        <!--            <div class="search-item" @click="showBrandRegistrationModal">-->
        <!--              등록하기-->
        <!--            </div>-->
        <!--          </div>-->
        <!--          <div class="selected-brands">-->
        <!--            <div-->
        <!--                v-for="brand in usualBrands"-->
        <!--                :key="brand.brandCd"-->
        <!--                class="selected-brand"-->
        <!--            >-->
        <!--              {{ brand.brandNmKor }}-->
        <!--              <span class="remove-brand" @click="removeUsualBrand(brand)">×</span>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
        <div>
          <label class="form-label">연락처</label>
          <input class="form-input" type="text" v-model="contactInfo" placeholder="연락처를 입력하세요"/>
        </div>
        <div>
          <label class="form-label">비고</label>
          <input class="form-input" type="text" v-model="shopDescription" placeholder="추가 정보나 특이사항을 입력하세요"/>
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
      :searchText="['00030002', '00030003'].includes(offlineStoreTypeCd) ? selectedBrandNmKor : usualBrandSearch"
      @close="closeBrandModal"
      @register="handleBrandRegistration"
  />

  <!-- Store Registration Modal -->
  <StoreRegistrationModal
      v-if="showStoreModal"
      :show="showStoreModal"
      :searchText="storeKorNm"
      :offlineStoreTypeCd="offlineStoreTypeCd"
      @close="closeStoreModal"
      @register="handleStoreRegistration"
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
