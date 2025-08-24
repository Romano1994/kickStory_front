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
    <!-- <div class="tab-container">
      <div class="tab-list">
        <button 
          class="tab-item" 
          :class="{ active: offlineStoreType === '00030001' }"
          @click="changeTab('00030001')"
        >
          오프라인
        </button>
        <button 
          class="tab-item" 
          :class="{ active: offlineStoreType === '00030002' }"
          @click="changeTab('00030002')"
        >
          온라인
        </button>
      </div>
    </div> -->
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
      <!-- <div v-if="branchType === '00030001' || branchType === '00030002'"> -->
        <div v-if="regionList.length" class="location-list">
          <div class="country-select-container">
            <select class="country-select" :value="selectedCountry" @change="handleCountryChange" >
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
                  <li class="store-item" v-for="store in district.offlineBranchList" :key="store.branchNm" @click="handleStoreClick(store)" :class="{ active: activeStore === store.branchNm }">
                      <span v-if="offlineStoreType === '00030001' || offlineStoreType === '00030002'">{{ store.storeKorNm }} {{ store.branchNm }}</span>
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
            <img src="@/assets/map/location-pin.png" alt="No Store" class="no-store-icon" />
            <div class="no-store-text">등록된 스토어 정보가 없습니다</div>
          </div>
        </div>
      <!-- </div> -->
      <!-- <div v-else-if="branchType === '00030003'">
        팝업샵 목록이 나올 자리
      </div> -->
    </div>
    <!-- <div class="online-content" v-if="branchType === '00030002'">
      <div class="online-placeholder">
        <p>온라인 발매처 목록이 여기에 표시됩니다.</p>
      </div>
    </div> -->
  </div>
</template>

<script>
import api from '@/js/menu/mixins/api/api-call';

export default {
  name: 'KicksMapStore',
  // props, emits 모두 삭제
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
        '/comm-cd/detail',
        { commCd: '0003' },
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
      this.getApi('/store/offline/countries/count',{offlineStoreType: this.offlineStoreType}, this.getCountryCountSuccess, this.getCountryCountFail)
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
      this.getApi('/store/offline/branches', { cntryCd:cntryCd, offlineStoreType : this.offlineStoreType }, this.getBranchesSuccess, this.getBranchesFail)
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
    selectedCountry(newCountry) {
      if (newCountry) {
        this.getBranches();
      }
    },
    offlineStoreType(newType) {
      if (newType) {
        this.getCountryCount();
        this.getBranches();
      }
    },
  },
  mounted() {
    this.fetchBranchTypeList();
    this.getCountryCount();
  }
}
</script>

<style scoped>
.search-box {
  background-color: var(--color2);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.search-container {
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
  flex-wrap: nowrap;
}

.search-select {
  width: 90px;
  min-width: 90px;
  padding: 8px;
  border: none;
  background-color: white;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: var(--main-font);
}

.search-input {
  flex: 1;
  min-width: 100px;
  padding: 8px;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: var(--main-font);
}

.search-btn {
  padding: 8px 16px;
  background-color: var(--color6);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-family: var(--sub-font);
  white-space: nowrap;
}

.register-btn {
  width: 100%;
  padding: 8px;
  background-color: var(--color6);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-family: var(--sub-font);
}

.tab-container {
  margin-bottom: 1rem;
}

.tab-list {
  display: flex;
  background-color: var(--color2);
  border-radius: 8px;
  overflow: hidden;
}

.tab-item {
  flex: 1;
  padding: 12px;
  background-color: transparent;
  border: none;
  color: var(--color1);
  font-family: var(--sub-font);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.tab-item.active {
  background-color: var(--color6);
  color: white;
}

.country-select-container {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.country-select {
  width: 100%;
  padding: 8px;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: var(--color1);
  font-size: 0.9rem;
  font-family: var(--main-font);
  cursor: pointer;
  transition: all 0.2s ease;
}

.country-select:focus {
  outline: none;
  border-color: var(--color6);
  background-color: rgba(255, 255, 255, 0.15);
}

.country-select option {
  background-color: var(--color2);
  color: var(--color1);
  font-family: var(--main-font);
}

.location-list {
  background-color: var(--color2);
  border-radius: 8px;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 500px;
  overflow-y: auto;
}

.location-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.city-header {
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: var(--color1);
  cursor: pointer;
  font-family: var(--sub-font);
  font-size: 1rem;
}

.arrow {
  color: var(--color1);
  transition: transform 0.3s ease;
}

.arrow.expanded {
  transform: rotate(90deg);
}

.store-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: var(--color5);
}

.store-item {
  padding: 0.8rem 2rem;
  color: var(--color1);
  font-size: 0.9rem;
  font-family: var(--main-font);
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.store-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.store-item.active {
  background-color: var(--color6);
  color: #fff;
  font-weight: bold;
}

.store-more-btn {
  margin-left: 1rem;
  padding: 4px 10px;
  background: var(--color6);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;
}
.store-more-btn:hover {
  background: #2a7a7f;
}

.district-list {
  padding-left: 1.5rem;
}
.district-header {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 0;
}

.district-header span {
  color: var(--color1);
}

.city-header span.arrow,
.district-header span.arrow {
  margin-right: 0;
}

.no-store-box {
  background-color: var(--color2);
  border-radius: 8px;
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  margin: 1rem 0;
}
.no-store-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  opacity: 0.7;
}
.no-store-text {
  color: var(--color1);
  font-family: var(--sub-font);
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
}

@media screen and (max-width: 1024px) {
  .search-container {
    gap: 4px;
  }
  .search-select {
    width: 80px;
    min-width: 80px;
  }
  .search-btn {
    padding: 8px 12px;
  }
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
  .no-store-box {
    padding: 2rem 0.5rem;
    min-height: 120px;
  }
  .no-store-icon {
    width: 36px;
    height: 36px;
  }
  .no-store-text {
    font-size: 1rem;
  }
}
</style> 