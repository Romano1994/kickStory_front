<script>
import AddressSearchModal from './AddressSearchModal.vue'
import BrandRegistrationModal from './BrandRegistrationModal.vue'
import CommonModal from './CommonModal.vue'

export default {
  name: 'RegisterModal',
  components: {
    AddressSearchModal,
    BrandRegistrationModal,
    CommonModal
  },
  data() {
    return {
      storeNo:0,
      storeKorNm: '',
      storeEngNm: '',
      cntry: '',
      branchNm: '',
      branchTypeCd: '00030001', // Default to offline
      place: '',
      website: '',
      // Store search related
      storeSearchTimeout: null,
      storeList: [],
      // Address search related
      addressList: [],
      showAddressModal: false,
      selectedAddress: {
        storeName: '',
        branchRoadAddr: '',
        branchAddr: '',
        lon: '',
        lat: ''
      },
      addressSearchTimeout: null,
      // Brand related
      limitedBrands: [],
      usualBrands: [],
      limitedBrandSearch: '',
      usualBrandSearch: '',
      limitedBrandList: [],
      usualBrandList: [],
      // Country search related
      countryList: [],
      cntryNm: {
        isoCntryNm: '',
        countryCd: '',
        countryKorNm: ''
      },
      // Branch search related
      branchList: [],
      storeTypeList: [
        { type: '오프라인', typeCd: '00030001' },
        { type: '온라인', typeCd: '00030002' }
      ],
      isStoreSelect: false,
      lastSelectedStore: null,
      showBrandModal: false,
      newBrand: {
        brandNmKor: '',
        brandNmEng: '',
        brandTypeCd: ''
      },
      brandTypes: [
        { type: '한정판', typeCd: '00010001' },
        { type: '상시', typeCd: '00010002' }
      ],
      showCommonModal: false,
      commonModalMessage: '',
      commonModalType: 'confirm'
    }
  },
  methods: {
    storeSearch() {
      if (this.storeSearchTimeout) {
        clearTimeout(this.storeSearchTimeout)
      }
      
      this.storeSearchTimeout = setTimeout(() => {
        // 선택된 스토어와 현재 입력값이 같으면 검색하지 않음
        if (this.lastSelectedStore && this.lastSelectedStore.storeKorNm === this.storeKorNm) {
          this.storeList = [];
          return;
        }
        
        if (this.storeKorNm.trim()) {
          this.storeEngNm = '';
          this.getApi('/store/name', {name: this.storeKorNm}, this.storeSearchSuccess, this.storeSearchFail);
        } else {
          this.storeList = [];
        }
      }, 500)
    },
    storeSearchSuccess(res) {
      this.storeList = res.data
    },
    storeSearchFail() {
      // console.error('Store search failed:', error)
      this.storeList = []
    },
    selectStore(store) {
      this.lastSelectedStore = store;
      this.storeNo = store.storeNo;
      this.storeKorNm = store.storeKorNm;
      this.storeEngNm = store.storeEngNm;
      this.storeList = [];
    },
    srchCntryList() {
        this.getApi('/store/country/names', {cntryKorNm : this.cntry}, this.srchCntrySucc, this.srchCntryFail);
    },
    srchCntrySucc(res) {
      this.countryList = res.data;
    },
    srchCntryFail(error) {
      console.error('Country search failed:', error);
      this.countryList = [];
    },
    selectCountry(country) {
      this.cntryNm = country.isoCntryNm;
      this.cntry = country.cntryKorNm;
      this.countryList = [];
    },
    closeModal() {
      this.$emit('close')
    },
    // Address search methods
    searchAddress() {
      if (this.addressSearchTimeout) {
        clearTimeout(this.addressSearchTimeout)
      }
      
      this.addressSearchTimeout = setTimeout(() => {
        if (this.place.trim()) {
          this.getApi(`/store/address/${this.place}`, null, this.searchAddressSuccess, this.searchAddressFail)
        } else {
          this.addressList = []
        }
      }, 500) // 500ms 대기
    },
    searchAddressSuccess(res) {
      this.addressList = res.data
    },
    searchAddressFail(error) {
      console.error('Address search failed:', error)
    },
    handleAddressSelect(address) {
      this.selectedAddress.storeName= address.storeName;
      this.selectedAddress.branchAddr = address.address;
      this.selectedAddress.branchRoadAddr = address.roadAddress;
      this.selectedAddress.lon = address.lon;
      this.selectedAddress.lat = address.lat;
      this.place = address.roadAddress;
    },
    // Limited brands methods
    searchLimitedBrands() {
      if (this.limitedBrandSearch.trim()) {
        this.getApi('/brand', { name: this.limitedBrandSearch }, this.searchLimitedBrandsSuccess, this.searchLimitedBrandsFail);
      } else {
        this.limitedBrandList = [];
      }
    },
    searchLimitedBrandsSuccess(res) {
      this.limitedBrandList = res.data;
    },
    searchLimitedBrandsFail(error) {
      console.error('Limited brands search failed:', error);
      this.limitedBrandList = [];
    },
    addLimitedBrand(brand) {
   
      if (!this.limitedBrands.some(b => b.brandNo === brand.brandNo && b.brandTypeCd===brand.brandTypeCd)) {
        this.limitedBrands.push({
          brandNo: brand.brandNo,
          brandNmKor: brand.brandNmKor,
          brandNmEng: brand.brandNmEng,
          brandTypeCd: brand.brandTypeCd
        });
      }
      this.limitedBrandSearch = '';
      this.limitedBrandList = [];
    },
    removeLimitedBrand(brand) {
      this.limitedBrands = this.limitedBrands.filter(b => b.brandNo !== brand.brandNo);
    },
    showBrandRegistrationModal() {
      this.showBrandModal = true;
    },
    closeBrandModal() {
      this.showBrandModal = false;
    },
    handleBrandRegistration(brand) {
      // TODO: Implement brand registration API call
      this.addLimitedBrand(brand);
    },
    // Usual brands methods
    searchUsualBrands() {
      if (this.usualBrandSearch.trim()) {
        this.getApi('/brand', { name: this.usualBrandSearch }, this.searchUsualBrandsSuccess, this.searchUsualBrandsFail);
      } else {
        this.usualBrandList = [];
      }
    },
    searchUsualBrandsSuccess(res) {
      this.usualBrandList = res.data;
    },
    searchUsualBrandsFail(error) {
      console.error('Usual brands search failed:', error);
      this.usualBrandList = [];
    },
    addUsualBrand(brand) {
      if (!this.usualBrands.some(b => b.brandNo === brand.brandNo && b.brandTypeCd === brand.brandTypeCd)) {
        this.usualBrands.push({
          brandNo: brand.brandNo,
          brandNmKor: brand.brandNmKor,
          brandNmEng: brand.brandNmEng,
          brandTypeCd: brand.brandTypeCd
        });
      }
      this.usualBrandSearch = '';
      this.usualBrandList = [];
    },
    removeUsualBrand(brand) {
      this.usualBrands = this.usualBrands.filter(b => b.brandNo !== brand.brandNo);
    },
    register() {
      if (this.branchTypeCd === '00030001') { // 오프라인 스토어
        const storeData = {
          branchTypeCd: this.branchTypeCd,
          storeKorNm: this.storeKorNm,
          storeEngNm: this.storeEngNm,
          storeNo: this.storeNo,
          cntryNm: this.cntryNm,
          branchNm: this.branchNm,
          branchRoadAddr: this.selectedAddress.branchRoadAddr,
          branchAddr: this.selectedAddress.branchAddr,
          lon: this.selectedAddress.lon,
          lat: this.selectedAddress.lat,
          limitedBrands: this.limitedBrands.map(brand => ({
            branchTypeCd: this.branchTypeCd,
            branchNo: null,
            brandNo: brand.brandNo,
            brandTypeCd: brand.brandTypeCd
          })),
          usualBrands: this.usualBrands.map(brand => ({
            branchTypeCd: this.branchTypeCd,
            branchNo: null,
            brandNo: brand.brandNo,
            brandTypeCd: brand.brandTypeCd
          }))
        };

        this.postApi('/store/registration', storeData, this.registerSuccess, this.registerFail);
      }
    },
    registerSuccess(res) {
      this.commonModalMessage = res.data;
      this.commonModalType = 'alert';
      this.showCommonModal = true;
    },
    registerFail(error) {
      this.commonModalMessage = error|| '등록에 실패했습니다.';
      this.commonModalType = 'alert';
      this.showCommonModal = true;
    },
    handleCommonModalConfirm() {
      this.showCommonModal = false;
      // registerSuccess에서 호출된 경우에만 RegisterModal을 닫음
      if (this.commonModalType === 'alert' && !this.commonModalMessage.includes('실패')) {
        this.closeModal();
      }
    }
  },
  watch: {

    // storeKorNm() {
    //   this.storeEngNm = '';
    //   // this.isStoreSelect = false;
    // }
  },
  beforeUnmount() {
    // 컴포넌트가 제거될 때 타이머 정리
    if (this.addressSearchTimeout) {
      clearTimeout(this.addressSearchTimeout)
    }
    if (this.storeSearchTimeout) {
      clearTimeout(this.storeSearchTimeout)
    }
  }
}
</script>

<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="register-modal" @click.stop>
      <div>
        <div>
          <span>유형</span>
          <select v-model="branchTypeCd">
            <option v-for="type in storeTypeList" 
                    :key="type.typeCd" 
                    :value="type.typeCd">
              {{ type.type }}
            </option>
          </select>
        </div>
        <div>
          <span>스토어명(한글)</span>
          <input type="text" v-model="storeKorNm" @input="storeSearch"/>
          <div v-if="storeList.length > 0" class="search-list">
            <div v-for="store in storeList" 
                 :key="store.storeId" 
                 @click="selectStore(store)"
                 class="search-item">
              {{ store.storeKorNm }}
            </div>
          </div>
        </div>
        <div>
          <span>스토어명(영문)</span>
          <input type="text" v-model="storeEngNm"/>
        </div>
        <div v-if="branchTypeCd === '00030001'">
          <span>국가명</span>
          <input type="text" v-model="cntry" @input="srchCntryList"/>
          <div v-if="countryList.length > 0" class="search-list">
            <div v-for="country in countryList" 
                 :key="country.cntryCd"
                 @click="selectCountry(country)"
                 class="search-item">
              {{ country.cntryKorNm }}
            </div>
          </div>
        </div>
        <div v-if="branchTypeCd === '00030001'">
          <span>지점명</span>
          <input type="text" v-model="branchNm" />
        </div>
        <div v-if="branchTypeCd === '00030001'">
          <span>주소검색</span>
          <div v-if="selectedAddress.branchRoadAddr" class="selected-address">
            {{ selectedAddress.branchRoadAddr }}
          </div>
          <button class="address-search-button" @click="showAddressModal = true">검색하기</button>
          <AddressSearchModal
            v-if="showAddressModal"
            @close="showAddressModal = false"
            @select="handleAddressSelect"
          />
        </div>
        <div v-else>
          <span>웹사이트 주소 입력</span>
          <input type="text" v-model="website"/>
        </div>
        <div>
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
        </div>
        <div>
          <span>상시 취급 브랜드</span>
          <input type="text" v-model="usualBrandSearch" @input="searchUsualBrands"/>
          <div v-if="usualBrandList.length > 0" class="search-list">
            <div v-for="brand in usualBrandList" 
                 :key="brand.brandNo" 
                 @click="addUsualBrand(brand)"
                 class="search-item">
              {{ brand.brandNmKor }}
            </div>
          </div>
          <div v-else-if="usualBrandSearch.trim()" class="search-list">
            <div class="search-item" @click="showBrandRegistrationModal">
              등록하기
            </div>
          </div>
          <div class="selected-brands">
            <div v-for="brand in usualBrands" 
                 :key="brand.brandNo" 
                 class="selected-brand">
              {{ brand.brandNmKor }}
              <span class="remove-brand" @click="removeUsualBrand(brand)">×</span>
            </div>
          </div>
        </div>
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
    :searchText="limitedBrandSearch"
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
</style>