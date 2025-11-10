<template>
  <div>
    <!-- 검색, 등록, 탭, 국가/지역/매장 리스트 등 기존 content의 발매처 관련 UI 복사 -->
    <div class="search-box">
      <div class="search-container">
        <select class="search-select">
          <option>한정판 발매 브랜드별</option>
          <option>상시 취급 브랜드별</option>
          <option>매장별</option>
        </select>
        <input type="text" class="search-input" placeholder="검색어를 입력하세요"/>
        <button class="search-btn">검색</button>
      </div>
      <div class="register-container">
        <button class="register-btn" @click="$emit('open-register-modal')">발매처 등록하기</button>
      </div>
    </div>
    <div class="tab-container" v-if="branchTypeList.length">
      <div class="tab-list">
        <button
            v-for="type in branchTypeList"
            :key="type.commCdDtl"
            class="tab-item"
            :class="{ active: offlineStoreType === type.commCdDtl }"
            @click="changeBranchType(type.commCdDtl)"
        >
          {{ type.commCdDtlNm }}
        </button>
      </div>
    </div>
    <div v-if="storeType === '00050001'">
      <div v-if="regionList.length" class="location-list">
        <div class="country-select-container">
          <select class="country-select" :value="selectedCountry" @change="handleCountryChange">
            <option v-for="country in countryList" :key="country.cntryCd" :value="country.cntryCd">
              {{ country.cntryKorNm }}({{ country.cntryCnt }})
            </option>
          </select>
        </div>
        <div class="location-item" v-for="city in regionList" :key="city.admSidoNm">
          <div class="city-header" @click="toggleCity(city.admSidoNm)">
            <span>{{ city.admSidoNm }}</span>
            <span class="arrow" :class="{ expanded: expandedCities[city.admSidoNm] }">&gt;</span>
          </div>
          <div v-show="expandedCities[city.admSidoNm]" class="district-list">
            <div class="district-item" v-for="district in city.admSggList" :key="district.admRginCd">
              <div class="district-header" @click="toggleDistrict(district.admRginCd)">
                <span>{{ district.admSggNm }}({{ district.cnt }})</span>
                <span class="arrow" :class="{ expanded: expandedDistricts[district.admRginCd] }">&gt;</span>
              </div>
              <ul class="store-list" v-show="expandedDistricts[district.admRginCd]">
                <li class="store-item" v-for="store in district.offlineBranchList" :key="store.branchNm"
                    @click="handleStoreClick(store)" :class="{ active: activeStore === store.branchNm }">
                  <span v-if="offlineStoreType === '00030001' || offlineStoreType === '00030002'">{{ store.storeKorNm }} {{
                      store.branchNm
                    }}</span>
                  <span v-if="offlineStoreType === '00030003'">{{ store.storeKorNm }}</span>
                  <button class="store-more-btn" @click.stop="$emit('store-more', store)">더보기</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="no-store-box">
          <img src="@/assets/map/location-pin.png" alt="No Store" class="no-store-icon"/>
          <div class="no-store-text">등록된 스토어 정보가 없습니다</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/js/menu/mixins/api/api-call';
import '@/css/kicks-map-store.css';

export default {
  name: 'KicksMapStore',
  data() {
    return {
      branchTypeList: [], // 지점 타입 리스트로 명칭 변경
      offlineStoreType: '00030001',
      storeType: '00050001',
      selectedCountry: 'KR',
      countryList: [],
      regionList: [],
      expandedCities: {},
      expandedDistricts: {},
      activeStore: null,
    }
  },
  methods: {
    changeBranchType(type) {
      this.offlineStoreType = type;
    },
    handleCountryChange(e) {
      this.selectedCountry = e.target.value;
      this.getBranches(this.selectedCountry);
    },
    toggleCity(city) {
      this.expandedCities = {
        ...this.expandedCities,
        [city]: !this.expandedCities[city]
      };
    },
    toggleDistrict(district) {
      this.expandedDistricts = {
        ...this.expandedDistricts,
        [district]: !this.expandedDistricts[district]
      };
    },
    handleStoreClick(store) {
      this.activeStore = store.branchNm;
    },
    fetchBranchTypeList() {
      api.get(
          '/common-codes/0003/details',
          null,
          this.handleBranchTypeListSuccess,
          this.handleBranchTypeListFail
      );
    },
    handleBranchTypeListSuccess(res) {
      this.branchTypeList = res.data; // 응답 구조에 따라 필요시 수정
    },
    handleBranchTypeListFail(err) {
      console.error('지점 타입 목록 불러오기 실패', err);
    },
    getCountryCount() {
      this.getApi('/stores/offline/countries/count', {offlineStoreType: this.offlineStoreType}, this.getCountryCountSuccess, this.getCountryCountFail)
    },
    getCountryCountSuccess(res) {
      this.countryList = res.data;
      if (this.countryList.length > 0) {
        this.selectedCountry = this.countryList[0].cntryCd;
        this.getBranches(this.selectedCountry);
      }
    },
    getCountryCountFail(error) {
      console.error('국가별 카운트 조회 실패:', error);
      this.countryList = [];
    },
    getBranches(cntryCd) {
      this.getApi('/stores/offline/branches', {
        cntryCd: cntryCd,
        offlineStoreType: this.offlineStoreType
      }, this.getBranchesSuccess, this.getBranchesFail)
    },
    getBranchesSuccess(res) {
      this.regionList = res.data;
    },
    getBranchesFail(error) {
      console.error('지역별 매장 수 조회 실패:', error);
      this.regionList = [];
    },
  },
  watch: {
    offlineStoreType(newType) {
      if (newType) {
        this.getCountryCount();
      }
    },
  },
  mounted() {
    this.fetchBranchTypeList();
    this.getCountryCount();
  }
}
</script>

