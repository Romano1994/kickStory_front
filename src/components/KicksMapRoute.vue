<template>
  <div class="route-content">
    <!-- 탭 선택 (편집샵, 브랜드샵, 팝업샵) -->
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

    <!-- 검색 기능 -->
    <div class="search-section">
      <div class="search-box">
        <input 
          type="text" 
          class="search-input" 
          :placeholder="getSearchPlaceholder()"
          v-model="searchKeyword"
        />
        <button class="search-btn" @click="searchStores">검색</button>
      </div>
      <!-- 검색 결과 -->
      <div class="search-results" v-if="searchResults.length > 0">
        <h5>검색 결과</h5>
        <ul class="search-result-list">
          <li 
            v-for="store in searchResults" 
            :key="store.branchNm" 
            class="search-result-item"
            @click="addStoreToRoute(store)"
          >
            <span>{{ store.storeKorNm }} {{ store.branchNm }}</span>
            <button class="add-btn">추가</button>
          </li>
        </ul>
      </div>
    </div>

    <!-- 지역별 스토어 목록 -->
    <div class="store-section" v-if="storeType === '00050001'">
      <div class="section-header">
        <h5>지역별 스토어</h5>
        <div class="country-select-container">
          <select class="country-select" :value="selectedCountry" @change="handleCountryChange">
            <option v-for="country in countryList" :key="country.cntryCd" :value="country.cntryCd">
              {{ country.cntryKorNm }}({{ country.cntryCnt }})
            </option>
          </select>
        </div>
      </div>
      
      <div v-if="regionStoreList.length" class="location-list">
        <div class="location-item" v-for="city in regionStoreList" :key="city.admSidoNm">
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
              <ul v-if="offlineStoreType !== '00030003'" class="store-list" v-show="expandedDistricts[district.admRginCd]">
                <li 
                  class="store-item" 
                  v-for="store in district.offlineBranchList" 
                  :key="store.branchNm" 
                  @click="openStoreDetail(store)" 
                  :class="{ active: activeStore === store.branchNm }"
                >
                  <span>{{ store.storeKorNm }} {{ store.branchNm }}</span>
                  <button class="add-btn"  @click="addStoreToRoute(store)" >추가</button>
                </li>
           
              </ul>
              <ul v-else class="store-list" v-show="expandedDistricts[district.admRginCd]">
                <li 
                  class="store-item" 
                  v-for="store in district.offlineBranchList" 
                  :key="store.storeCd" 
                  @click="openStoreDetail(store)" 
                  :class="{ active: activeStore === store.storeCd }"
                >
                  <span >{{ store.storeKorNm }}</span>
                  <button class="add-btn"  @click="addStoreToRoute(store)" >추가</button>
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
    </div>

    <!-- 경로 설정 -->
    <div class="route-section">
      <div class="section-header">
        <h5>경로 검색 방식</h5>
      </div>
      <div class="btn-group route-type-toggle" role="group" aria-label="Route Type Toggle">
        <button
          type="button"
          class="btn"
          :class="selectedType === 'optimal' ? 'btn-primary' : 'btn-outline-primary'"
          @click="selectType('optimal')"
        >최적경로</button>
        <button
          type="button"
          class="btn"
          :class="selectedType === 'fixed' ? 'btn-primary' : 'btn-outline-primary'"
          @click="selectType('fixed')"
        >도착지 고정</button>
      </div>
    </div>

    <!-- 선택된 경로 -->
    <div class="selected-route-section">
      <div class="section-header">
        <h5>선택된 경로</h5>
        <span class="store-count">({{ selectedStores.length }}개)</span>
      </div>
      <div class="selected-stores">
        <ul>
          <li v-for="(store, index) in selectedStores" :key="store.branchNm">
            <span class="store-order">{{ index + 1 }}</span>
            <span class="store-name">{{ store.storeKorNm }} {{ store.branchNm }}</span>
            <button @click="removeStore(store)" class="remove-btn">제거</button>
          </li>
        </ul>
        <div v-if="!selectedStores.length" class="empty-route">
          스토어를 추가해주세요
        </div>
      </div>
      <button class="find-route-btn" @click="findRoute" :disabled="selectedStores.length === 0">
        경로 찾기
      </button>
    </div>

    <CommonModal
      :show="showRouteModal"
      type="alert"
      title="경로 안내"
      :content="routeModalContent"
      @close="closeRouteModal"
      @confirm="closeRouteModal"
    />
  </div>
</template>
<script>
import CommonModal from './CommonModal.vue';
import api from '@/js/menu/mixins/api/api-call';

export default {
  name: 'KicksMapRoute',
  components: { CommonModal },
  emits: [
    'draw-route',
    'open-register-modal',
    'store-more',
    'update-region-list',
    'add-store',
    'remove-store',
    'store-type-change'
  ],
  props: {
    selectedStores: {
      type: Array,
      default: () => []
    },
    offlineStoreType: {
      type: String,
      default: '00030001'
    }
  },
  data() {
    return {
      selectedType: 'optimal',
      // selectedStores is provided by parent via props
      currentLocation: null, // { lat, lon }
      showRouteModal: false,
      routeModalContent: '',
      branchTypeList: [], // 지점 타입 리스트로 명칭 변경
      // offlineStoreType is now provided by parent via props
      storeType: '00050001',
      selectedCountry: 'KR',
      countryList: [],
      regionStoreList: [],
      expandedCities: {},
      expandedDistricts: {},
      activeStore: null,
      searchKeyword: '',
      searchResults: [],
    }
  },
  methods: {
    selectType(type) {
      this.selectedType = type;
      this.$emit('route-type-change', type);
    },
    changeBranchType(type) {
      this.$emit('store-type-change', type);
      this.searchResults = []; // 탭 변경시 검색 결과 초기화
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
    addStoreToRoute(store) {
      this.$emit('add-store', store);
    },
    openStoreDetail(store) {
      if(this.offlineStoreType !== '00030003'){
        this.activeStore = store.branchNm;
      } else {
        this.activeStore = store.storeCd;
      }
      //TODO : 스토어 상세페이지 열기
    },
    removeStore(store) {
      this.$emit('remove-store', store);
    },
    getSearchPlaceholder() {
      const placeholders = {
        '00030001': '편집샵 검색 (예: 나이키, 아디다스)',
        '00030002': '브랜드샵 검색 (예: 나이키, 아디다스)',
        '00030003': '팝업샵 검색 (예: 한정판, 특별전)'
      };
      return placeholders[this.offlineStoreType] || '스토어 검색';
    },
    searchStores() {
      // 검색 로직은 나중에 구현
      console.log('검색:', this.searchKeyword);
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
      this.regionStoreList = res.data;
      this.$emit('update-region-list', this.regionStoreList);
    },
    getBranchesFail(error) {
      console.error('지역별 매장 수 조회 실패:', error);
      this.regionStoreList = [];
      this.$emit('update-region-list', this.regionStoreList);
    },
    async findRoute() {
      if (!this.currentLocation) {
        alert('현재 위치 정보를 가져올 수 없습니다.');
        return;
      }
      if (this.selectedStores.length === 0) {
        alert('경로에 추가된 매장이 없습니다.');
        return;
      }
      const coords = this.selectedStores.map(store => `${store.lon},${store.lat}`).join(';');
      const url = `https://router.project-osrm.org/trip/v1/foot/${coords}?roundtrip=false&source=first&destination=any&overview=full&geometries=polyline`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.code === 'Ok' && data.trips && data.trips.length > 0) {
          const trip = data.trips[0];
          const distKm = (trip.distance / 1000).toFixed(2);
          const durationMin = (trip.duration / 60).toFixed(1);
          this.routeModalContent = `경로 총 거리: ${distKm}km, 예상 소요: ${durationMin}분`;
          this.showRouteModal = true;
          const coordsArr = this.decodePolyline(trip.geometry);
          this.$emit('draw-route', coordsArr);
        } else {
          alert('경로를 찾을 수 없습니다.');
        }
      } catch (e) {
        alert('경로 탐색 실패');
        console.error(e);
      }
    },
    decodePolyline(str, precision = 5) {
      let index = 0, lat = 0, lng = 0, coordinates = [], shift = 0, result = 0, byte = null;
      const factor = Math.pow(10, precision);
      while (index < str.length) {
        shift = 0; result = 0;
        do {
          byte = str.charCodeAt(index++) - 63;
          result |= (byte & 0x1f) << shift;
          shift += 5;
        } while (byte >= 0x20);
        const deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += deltaLat;
        shift = 0; result = 0;
        do {
          byte = str.charCodeAt(index++) - 63;
          result |= (byte & 0x1f) << shift;
          shift += 5;
        } while (byte >= 0x20);
        const deltaLng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += deltaLng;
        coordinates.push([lat / factor, lng / factor]);
      }
      return coordinates;
    },
    closeRouteModal() {
      this.showRouteModal = false;
    },
  },
  watch: {
    regionStoreList: {
      handler(newVal) {
        this.$emit('update-region-list', newVal);
      },
      deep: true
    },
    offlineStoreType: {
      handler(newType) {
        if (newType) {
          this.getCountryCount();
        }
      },
      immediate: true
    },
  },
  mounted() {
    this.fetchBranchTypeList();
    this.getCountryCount();
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다.', error);
          this.currentLocation = null;
        }
      );
    }
  }
}
</script>
<style scoped>
@import '../css/main.css';
@import '../css/map.css';

.route-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  overflow-y: auto;
}

/* 탭 스타일 */
.tab-container {
  margin-bottom: 0.5rem;
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

/* 검색 섹션 */
.search-section {
  background-color: var(--color2);
  border-radius: 8px;
  padding: 1rem;
}

.search-box {
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: var(--main-font);
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color1);
}

.search-input::placeholder {
  color: rgba(255, 244, 204, 0.6);
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

.search-results {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
}

.search-results h5 {
  margin: 0 0 0.7rem 0;
  color: var(--color1);
  font-family: var(--sub-font);
  font-size: 1rem;
  font-weight: bold;
}

.search-result-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color1);
  font-size: 0.9rem;
  font-family: var(--main-font);
  cursor: pointer;
}

.search-result-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.add-btn {
  padding: 4px 8px;
  background: var(--color6);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;
}

.add-btn:hover {
  background: #2a7a7f;
}

/* 스토어 섹션 */
.store-section {
  background-color: var(--color2);
  border-radius: 8px;
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 300px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.inline-legend {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color1);
  font-family: var(--sub-font);
  font-size: 0.8rem;
}
.legend-item img {
  width: 12px;
  height: 20px;
  object-fit: contain;
}

.section-header h5 {
  margin: 0;
  color: var(--color1);
  font-family: var(--sub-font);
  font-size: 1rem;
  font-weight: bold;
}

.country-select-container {
  flex-shrink: 0;
}

.country-select {
  padding: 6px 8px;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: var(--color1);
  font-size: 0.8rem;
  font-family: var(--main-font);
  cursor: pointer;
}

.location-list {
  flex: 1;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.location-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.city-header {
  padding: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: var(--color1);
  cursor: pointer;
  font-family: var(--sub-font);
  font-size: 0.95rem;
}

.arrow {
  color: var(--color1);
  transition: transform 0.3s ease;
}

.arrow.expanded {
  transform: rotate(90deg);
}

.district-list {
  padding-left: 1.5rem;
}

.district-header {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.6rem 0;
}

.district-header span {
  color: var(--color1);
  font-size: 0.9rem;
}

.store-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: var(--color5);
}

.store-item {
  padding: 0.7rem 1.5rem;
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

.no-store-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--color1);
  font-family: var(--sub-font);
  font-size: 1rem;
}

.no-store-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  opacity: 0.7;
}

/* 경로 설정 섹션 */
.route-section {
  background-color: var(--color2);
  border-radius: 8px;
  padding: 1rem;
}

.route-type-toggle {
  display: flex;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: none;
}

.route-type-toggle .btn {
  flex: 1;
  text-align: center;
  border: none;
  background: transparent;
  color: var(--color1);
  font-family: var(--sub-font);
  font-size: 0.9rem;
  padding: 10px 0;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  border-radius: 0;
}

.route-type-toggle .btn.btn-primary {
  background-color: var(--color6);
  color: #fff;
  font-weight: bold;
}

.route-type-toggle .btn.btn-outline-primary {
  background-color: transparent;
  color: var(--color1);
  font-weight: normal;
}

.route-type-toggle .btn:not(:last-child) {
  border-right: 1px solid rgba(255,255,255,0.12);
}

/* 선택된 경로 섹션 */
.selected-route-section {
  background-color: var(--color2);
  border-radius: 8px;
  padding: 1rem;
}

.store-count {
  color: var(--color6);
  font-size: 0.9rem;
  font-weight: bold;
}

.selected-stores {
  margin-bottom: 1rem;
}

.selected-stores ul {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
}

.selected-stores li {
  display: flex;
  align-items: center;
  padding: 0.7rem 0.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  color: var(--color1);
  font-size: 0.9rem;
  font-family: var(--main-font);
}

.selected-stores li:last-child {
  border-bottom: none;
}

.store-order {
  background-color: var(--color6);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  margin-right: 0.8rem;
  flex-shrink: 0;
}

.store-name {
  flex: 1;
  margin-right: 0.8rem;
}

.remove-btn {
  padding: 4px 8px;
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: #c0392b;
}

.empty-route {
  text-align: center;
  color: #aaa;
  font-size: 0.9rem;
  padding: 2rem 0;
  font-style: italic;
}

.find-route-btn {
  width: 100%;
  background-color: var(--color6);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: var(--sub-font);
  font-size: 1rem;
  font-weight: bold;
  padding: 12px 0;
  cursor: pointer;
  transition: background 0.2s;
}

.find-route-btn:hover:not(:disabled) {
  background: #2a7a7f;
}

.find-route-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media screen and (max-width: 1024px) {
  .search-box {
    gap: 4px;
  }
  
  .search-btn {
    padding: 8px 12px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media screen and (max-width: 720px) {
  .route-content {
    gap: 0.5rem;
  }
  
  .search-section,
  .store-section,
  .route-section,
  .selected-route-section {
    padding: 0.8rem;
  }
  
  .store-item {
    padding: 0.6rem 1rem;
  }
  
  .selected-stores li {
    padding: 0.6rem 0.3rem;
  }
}
</style> 