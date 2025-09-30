<template>
  <!-- TODO : 매장 이름 누르면 매장 정보 띄우기기 -->
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
      <div class="search-container">
        <div class="search-box">
          <input
              type="text"
              class="search-input"
              :placeholder="getSearchPlaceholder()"
              v-model="searchKeyword"
              @input="filterStores"
          />
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
              <ul v-if="offlineStoreType !== '00030003'" class="store-list"
                  v-show="expandedDistricts[district.admRginCd]">
                <li
                    class="store-item"
                    v-for="store in district.offlineBranchList"
                    :key="store.branchCd"
                
                    :class="{ active: activeStore === store.branchNm }"
                >
                  <span>{{ store.storeKorNm }} {{ store.branchNm }}</span>
                  <div class="store-actions">
                    <button class="view-btn" @click="openStoreDetail(store)">보기</button>
                    <button class="add-btn" @click="addStoreToRoute(store)">추가</button>
                  </div>
                </li>

              </ul>
              <ul v-else class="store-list" v-show="expandedDistricts[district.admRginCd]">
                <li
                    class="store-item"
                    v-for="store in district.offlineBranchList"
                    :key="store.storeCd"
                    
                    :class="{ active: activeStore === store.storeCd }"
                >
                  <span>{{ store.storeKorNm }}</span>
                  <div class="store-actions">
                    <button class="view-btn" @click="openStoreDetail(store)">보기</button>
                    <button class="add-btn" @click="addStoreToRoute(store)">추가</button>
                  </div>
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
      <!-- <button class="register-btn" @click="$emit('open-register-modal')">스토어 등록하기</button> -->
    </div>

    <!-- 경로 설정 -->
    <RouteTypeSelector
        :selected-type="selectedType"
        @type-change="selectType"
        @show-help="showRouteHelpModal"
    />

    <!-- 선택된 경로 -->
    <div class="selected-route-section">
      <div class="section-header">
        <div class="route-header-left">
          <h5>선택된 경로</h5>
          <span class="store-count">({{ selectedStores.length }}개)</span>
        </div>
        <div class="route-header-right">
          <label class="current-location-toggle">
            <input type="checkbox" v-model="useCurrentLocation" class="toggle-checkbox">
            <span class="toggle-slider"></span>
            <span class="toggle-text">현재 위치 시작</span>
          </label>
        </div>
      </div>
      <div class="selected-stores">
        <ul>
          <li v-if="useCurrentLocation" class="current-location-item">
            <span class="store-order">📍</span>
            <span class="store-name">현재 위치</span>
          </li>
          <li v-for="(store, index) in selectedStores" :key="store.branchNm">
            <!-- <span class="store-order">{{ index + 1 }}</span> -->
            <span class="store-order">{{ useCurrentLocation ? index + 2 : index + 1 }}</span>
            <span class="store-name">{{ store.storeKorNm }} {{ store.branchNm }}</span>
            <button @click="removeStore(store)" class="remove-btn">제거</button>
          </li>
        </ul>
        <div v-if="!selectedStores.length" class="empty-route">
          스토어를 추가해주세요
        </div>
      </div>
      <button class="find-route-btn" @click="findRoute" :disabled="routeButtonDisabled">
        경로 찾기
      </button>
      <button class="add-favorite-btn" @click="addToFavorites" :disabled="favoriteButtondisable">
        즐겨찾기 추가
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

    <CommonModal
        :show="isShowRouteHelpModal"
        type="alert"
        title="경로 검색 방식 안내"
        :htmlContent="`
        <div style='text-align: left; line-height: 1.8;'>
          <div style='margin-bottom: 1rem;'>
            <strong style='color: var(--color6); font-size: 1.1rem;'>🎯 최적경로</strong>
            <p style='margin: 0.5rem 0 0 0; color: var(--color1);'>'현재 위치 시작'이 활성화되지 않은 경우, 처음 스토어를 기준으로 가장 효율적인 순서로 방문하는 경로를 찾습니다.</p>
          </div>
          <div>
            <strong style='color: var(--color6); font-size: 1.1rem;'>📍 도착지 고정</strong>
            <p style='margin: 0.5rem 0 0 0; color: var(--color1);'>선택된 경로 중 마지막 스토어를 최종 목적지로 설정하고, 그외의 스토어들은 최적 경로로 방문하는 경로를 찾습니다. '현재 위치 시작'이 활성화 되지 않은 경우, 첫 스토어 기준으로 경로를 찾습니다.</p>
          </div>
          <div style='margin-bottom: 1rem;'>
            <strong style='color: var(--color6); font-size: 1.1rem;'>🔢 순차 검색</strong>
            <p style='margin: 0.5rem 0 0 0; color: var(--color1);'>선택된 스토어들을 추가한 순서대로 방문하는 경로를 찾습니다.</p>
          </div>
        </div>
      `"
        @close="closeRouteHelpModal"
        @confirm="closeRouteHelpModal"
    />

    <FavoriteRegisterModal
        v-if="showFavoriteModal"
        :selectedStores="selectedStores"
        @close="closeFavoriteModal"
        @save="saveFavoriteSuccess"
    />

    <CommonModal
        :show="showAlertModal"
        type="alert"
        :title="alertTitle"
        :content="alertContent"
        @close="closeAlertModal"
        @confirm="closeAlertModal"
    />
    
    <StoreDetailModal
        :show="showStoreDetailModal"
        :store="storeDetailData || {}"
        :offlineStoreType="offlineStoreType"
        @close="closeStoreDetailModal"
    />
  </div>
</template>
<script>
import CommonModal from './CommonModal.vue';
import FavoriteRegisterModal from './FavoriteRegisterModal.vue';
import RouteTypeSelector from './RouteTypeSelector.vue';
import StoreDetailModal from './StoreDetailModal.vue';
import api from '@/js/menu/mixins/api/api-call';

export default {
  name: 'KicksMapRoute',
  components: {CommonModal, FavoriteRegisterModal, RouteTypeSelector, StoreDetailModal},
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
      useCurrentLocation: true,
      // selectedStores is provided by parent via props
      currentLocation: null, // { lat, lon }
      showRouteModal: false,
      routeModalContent: '',
      isShowRouteHelpModal: false,
      branchTypeList: [], // 지점 타입 리스트로 명칭 변경
      // offlineStoreType is now provided by parent via props
      storeType: '00050001',
      selectedCountry: 'KR',
      countryList: [],
      regionStoreList: [],
      originalStoreList: [], // 원본 스토어 데이터 저장용
      expandedCities: {},
      expandedDistricts: {},
      activeStore: null,
      searchKeyword: '',
      showFavoriteModal: false,
      showAlertModal: false,
      alertTitle: '',
      alertContent: '',
      showStoreDetailModal: false,
      storeDetailData: null
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
      if (this.offlineStoreType !== '00030003') {
        this.activeStore = store.branchCd;
      } else {
        this.activeStore = store.storeCd;
      }
      //TODO : 스토어 상세페이지 열기
      const storeCd = store && store.storeCd;
      if (!storeCd) {
        this.showAlert('', '스토어 정보보가 없습니다.');
        return;
      }
      this.getApi('/branch', {storeCd:store.storeCd, branchCd:store.branchCd, offlineStoreTypeCd:this.offlineStoreType}, this.openStoreDetailSuccess, this.openStoreDetailFail);
    },
    removeStore(store) {
      this.$emit('remove-store', store);
    },
    getSearchPlaceholder() {
      const placeholders = {
        '00030001': '편집샵 검색 (예: 웍스아웃, 카시나)',
        '00030002': '브랜드샵 검색 (예: 나이키, 아디다스)',
        '00030003': '팝업샵 검색 (예: 귀멸의 칼날 팝업)'
      };
      return placeholders[this.offlineStoreType] || '스토어 검색';
    },
    searchStores() {
      const keyword = (this.searchKeyword || '').trim();
      if (!keyword) {
        this.searchResults = [];
        return;
      }

      const lowerKeyword = keyword.toLowerCase();
      const seen = new Set();
      const results = [];

      // 현재 국가에 대한 지역별 스토어 목록(this.regionStoreList)에서 검색
      this.regionStoreList.forEach(city => {
        (city.admSggList || []).forEach(district => {
          (district.offlineBranchList || []).forEach(store => {
            const kor = String(store.storeKorNm || '').toLowerCase();
            const eng = String(store.storeEngNm || '').toLowerCase();
            const isMatch = kor.includes(lowerKeyword) || eng.includes(lowerKeyword);
            if (!isMatch) return;

            const key = this.offlineStoreType !== '00030003'
                ? `B-${store.branchCd}`
                : `S-${store.storeCd}`;
            if (key && !seen.has(key)) {
              seen.add(key);
              results.push(store);
            }
          });
        });
      });

      this.searchResults = results;
    },
    fetchBranchTypeList() {
      api.get(
          '/comm-cd/detail',
          {commCd: '0003'},
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
      this.getApi('/store/offline/countries/count', {offlineStoreType: this.offlineStoreType}, this.getCountryCountSuccess, this.getCountryCountFail)
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
      this.getApi('/store/offline/branches', {
        cntryCd: cntryCd,
        offlineStoreType: this.offlineStoreType
      }, this.getBranchesSuccess, this.getBranchesFail)
    },
    getBranchesSuccess(res) {
      this.originalStoreList = JSON.parse(JSON.stringify(res.data)); // 깊은 복사로 원본 데이터 저장
      this.regionStoreList = res.data;
      this.$emit('update-region-list', this.regionStoreList);
    },
    filterStores() {
      const keyword = (this.searchKeyword || '').trim().toLowerCase();

      // 원본 데이터에서 필터링된 스토어만 보여주기
      if (this.originalStoreList.length === 0) return;

      if (!keyword) {
        // 검색어가 없으면 원본 데이터로 복원하고 모든 도시/구/군 접기
        this.regionStoreList = JSON.parse(JSON.stringify(this.originalStoreList));
        // 모든 도시와 구/군 접기
        this.expandedCities = {};
        this.expandedDistricts = {};
        return;
      }

      this.regionStoreList = this.originalStoreList.map(city => {
        // 도시 레벨에서 필터링
        const filteredCity = {...city};

        // 구/군 레벨에서 필터링
        filteredCity.admSggList = (city.admSggList || []).map(district => {
          const filteredDistrict = {...district};

          // 스토어 레벨에서 필터링
          filteredDistrict.offlineBranchList = (district.offlineBranchList || []).filter(store => {
            const storeName = String(store.storeKorNm || '').toLowerCase();
            const branchName = String(store.branchNm || '').toLowerCase();
            const engName = String(store.storeEngNm || '').toLowerCase();

            return storeName.includes(keyword) ||
                branchName.includes(keyword) ||
                engName.includes(keyword);
          });

          // 검색어가 있으면 해당 구/군 확장
          if (keyword && filteredDistrict.offlineBranchList.length > 0) {
            this.expandedDistricts = {
              ...this.expandedDistricts,
              [district.admRginCd]: true
            };
          }

          return filteredDistrict;
        }).filter(district => district.offlineBranchList.length > 0); // 스토어가 없는 구/군은 제거

        // 검색어가 있으면 해당 도시 확장
        if (keyword && filteredCity.admSggList.length > 0) {
          this.expandedCities = {
            ...this.expandedCities,
            [city.admSidoNm]: true
          };
        }

        return filteredCity;
      }).filter(city => city.admSggList.length > 0); // 구/군이 없는 도시는 제거
    },
    getBranchesFail(error) {
      console.error('지역별 매장 수 조회 실패:', error);
      this.regionStoreList = [];
      this.$emit('update-region-list', this.regionStoreList);
    },
    findRoute() {
      if (this.useCurrentLocation && !this.currentLocation) {
        this.showAlert('위치 오류', '현재 위치 정보를 가져올 수 없습니다.');
        return;
      }
      if (this.selectedStores.length === 0) {
        this.showAlert('경로 오류', '경로에 추가된 매장이 없습니다.');
        return;
      }
      let coords = null;
      let url = null;
      let storeCds = this.selectedStores.map(store => store.storeCd).join(",");

      if (this.useCurrentLocation) {
        coords = this.currentLocation.lon + ',' + this.currentLocation.lat + ';' + this.selectedStores.map(store => `${store.lon},${store.lat}`).join(';');
      } else {
        coords = this.selectedStores.map(store => `${store.lon},${store.lat}`).join(';');
      }


      if (this.selectedType === 'sequential') {
        // 순차 검색: 선택된 순서대로 방문
        //url = `https://router.project-osrm.org/route/v1/foot/${coords}?overview=full&geometries=polyline`;
        url = `selectedType=${this.selectedType}&coords=${coords}&storeCds=${storeCds}&overview=full&geometries=polyline`;
      } else if (this.selectedType === 'optimal') {
        // 최적경로: 가장 효율적인 순서로 방문
        // url = `https://router.project-osrm.org/trip/v1/foot/${coords}?roundtrip=false&source=first&destination=any&overview=full&geometries=polyline`;
        url = `selectedType=${this.selectedType}&coords=${coords}&storeCds=${storeCds}&roundtrip=false&overview=full&geometries=polyline`;
      } else {
        // 도착지 고정: 마지막 스토어를 목적지로 고정
        //url = `https://router.project-osrm.org/trip/v1/foot/${coords}?roundtrip=false&source=first&destination=last&overview=full&geometries=polyline`;
        url = `selectedType=${this.selectedType}&coords=${coords}&storeCds=${storeCds}&roundtrip=false&source=first&destination=last&overview=full&geometries=polyline`;
      }

      this.getApi("/navigation?" + url, null, this.findRouteSuccess, this.findRouteFail)

      // try {
      //   const res = await fetch(url);
      //   const data = await res.json();

      //   if (data.code === 'Ok') {
      //     let routeData = null;
      //     let wayPoints = data.waypoints;

      //     if (this.selectedType === 'sequential') {
      //       // 순차 검색의 경우 routes 배열 사용
      //       if (data.routes && data.routes.length > 0) {
      //         routeData = data.routes[0];
      //       }
      //     } else {
      //       // 최적경로, 도착지 고정의 경우 trips 배열 사용
      //       if (data.trips && data.trips.length > 0) {
      //         routeData = data.trips[0];
      //       }
      //     }

      //     if (routeData) {
      //       const distKm = (routeData.distance / 1000).toFixed(2);
      //       this.routeModalContent = `경로 총 거리: ${distKm}km`;
      //       this.showRouteModal = true;
      //       const coordsArr = this.decodePolyline(routeData.geometry);
      //       this.$emit('draw-route', coordsArr, wayPoints);
      //     } else {
      //       this.showAlert('경로 오류', '경로를 찾을 수 없습니다.');
      //     }
      //   } else {
      //     this.showAlert('경로 오류', '경로를 찾을 수 없습니다.');
      //   }
      // } catch (e) {
      //   this.showAlert('경로 오류', '경로 탐색 실패');
      //   console.error(e);
      // }
    },
    findRouteSuccess(res) {
      const data = res.data;
      if (data.code === 'Ok') {
        let routeData = null;
        let wayPoints = data.waypoints;

        if (this.selectedType === 'sequential') {
          // 순차 검색의 경우 routes 배열 사용
          if (data.routes && data.routes.length > 0) {
            routeData = data.routes[0];
          }
        } else {
          // 최적경로, 도착지 고정의 경우 trips 배열 사용
          if (data.trips && data.trips.length > 0) {
            routeData = data.trips[0];
          }
        }

        if (routeData) {
          const distKm = (routeData.distance / 1000).toFixed(2);
          this.routeModalContent = `경로 총 거리: ${distKm}km`;
          this.showRouteModal = true;
          const coordsArr = this.decodePolyline(routeData.geometry);
          this.$emit('draw-route', coordsArr, wayPoints);
        } else {
          this.showAlert('경로 오류', '경로를 찾을 수 없습니다.');
        }
      } else {
        const serverMessage = data && (data.message || data.msg || data.error || data.statusMessage);
        this.showAlert('경로 오류', serverMessage || '경로를 찾는 중 오류가 발생하였습니다.');
      }
    },
    findRouteFail(err) {
      const serverMessage = err && err.response && err.response.data && (err.response.data.message || err.response.data.msg || err.response.data.error || err.response.data.statusMessage);
      const fallback = err && (err.message || '경로를 찾는 중 오류가 발생하였습니다.');
      this.showAlert('경로 오류', serverMessage || fallback);
      console.error('findRouteFail:', err);
    },
    decodePolyline(str, precision = 5) {
      let index = 0, lat = 0, lng = 0, coordinates = [], shift = 0, result = 0, byte = null;
      const factor = Math.pow(10, precision);
      while (index < str.length) {
        shift = 0;
        result = 0;
        do {
          byte = str.charCodeAt(index++) - 63;
          result |= (byte & 0x1f) << shift;
          shift += 5;
        } while (byte >= 0x20);
        const deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += deltaLat;
        shift = 0;
        result = 0;
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
    showRouteHelpModal() {
      this.isShowRouteHelpModal = true;
    },
    closeRouteHelpModal() {
      this.isShowRouteHelpModal = false;
    },
    addToFavorites() {
      if (this.selectedStores.length === 0) return;
      this.showFavoriteModal = true;
    },
    closeFavoriteModal() {
      this.showFavoriteModal = false;
    },
    saveFavoriteSuccess() {
      this.showAlert('성공', '즐겨찾기에 추가되었습니다!');
      this.closeFavoriteModal();
    },
    openStoreDetailSuccess(res) {
      const data = res && res.data != null ? res.data : res;
      if (!data) {
        this.showAlert('상세 오류', '스토어 정보를 불러오지 못했습니다.');
        return;
      }
      this.storeDetailData = data;
      this.showStoreDetailModal = true;
    },
    openStoreDetailFail(err) {
      const serverMessage = err && err.response && err.response.data && (err.response.data.message || err.response.data.msg || err.response.data.error || err.response.data.statusMessage);
      const fallback = err && (err.message || '스토어 정보를 불러오지 못했습니다.');
      this.showAlert('상세 오류', serverMessage || fallback);
      console.error('openStoreDetailFail:', err);
    },
    showAlert(title, content) {
      this.alertTitle = title;
      this.alertContent = content;
      this.showAlertModal = true;
    },
    closeAlertModal() {
      this.showAlertModal = false;
      this.alertTitle = '';
      this.alertContent = '';
    },
    closeStoreDetailModal() {
      this.showStoreDetailModal = false;
      this.storeDetailData = null;
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
  computed: {
    routeButtonDisabled() {
      let firstCondition = !this.useCurrentLocation && this.selectedStores.length > 1;
      let secondCondition = this.useCurrentLocation && this.selectedStores.length > 0;
      return !(firstCondition || secondCondition);
    },
    favoriteButtondisable() {
      if (this.selectedStores.length > 1) return false;
      return true;
    }
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
            this.useCurrentLocation = false;
          }
      );
    }
  }
}
</script>
<style scoped>
@import '../css/main.css';
@import '../css/map.css';
</style> 