<template>
  <div class="favorite-content">
    <!-- 경로 설정 -->
    <div class="route-settings-container">
      <RouteTypeSelector
          :selected-type="selectedType"
          @type-change="selectType"
          @show-help="showRouteHelpModal"
      />
      <!-- 현재 위치 시작 토글 -->
      <div class="location-toggle-section">
        <label class="current-location-toggle">
          <input type="checkbox" v-model="useCurrentLocation" class="toggle-checkbox" @change="handleCurrentLocationToggle">
          <span class="toggle-slider"></span>
          <span class="toggle-text">현재 위치 시작</span>
        </label>
      </div>
    </div>

    <div v-if="favoriteCourses.length === 0" class="empty-placeholder">
      <p>저장된 즐겨찾기가 없습니다.</p>
    </div>
    <div v-else class="favorite-list">
      <div
          v-for="(favorite, index) in favoriteCourses"
          :key="index"
          class="favorite-item"
          :class="{ active: currentCourseName === favorite.favoriteCourseName }"
      >
        <div class="favorite-header" @click="changeCurrentStores(favorite)">
          <div class="favorite-title-section">
            <h3 class="favorite-name">{{ favorite.favoriteCourseName }}</h3>
            <button
                class="toggle-btn"
                @click.stop="toggleFavoriteCollapse(index)"
                :title="isFavoriteCollapsed(index) ? '펼치기' : '접기'"
            >
              {{ isFavoriteCollapsed(index) ? '▶' : '▼' }}
            </button>
          </div>
          <div class="favorite-actions" @click.stop>
            <button
                class="delete-btn"
                @click="deleteFavorite(index)"
                title="삭제"
            >
              🗑️
            </button>
          </div>
        </div>
        <div v-if="favorite.description" class="favorite-description">
          {{ favorite.description }}
        </div>
        <div v-if="!isFavoriteCollapsed(index)" class="favorite-details">
          <div class="favorite-info">
            <span class="store-count">스토어 {{ favorite.stores.length }}개</span>
            <span class="created-date">{{ formatDate(favorite.createdAt) }}</span>
          </div>
          <div class="store-preview">
            <div
                v-for="(store, storeIndex) in favorite.stores"
                :key="storeIndex"
                class="store-preview-item"
            >
              <span class="store-order">{{ storeIndex + 1 }}</span>
              <span class="store-name">{{ store.storeKorNm }} {{ store.branchNm || '' }}</span>
            </div>
          </div>
        </div>
            <!-- 경로 찾기 버튼 (항상 표시) -->
            <div class="favorite-route-action">
          <button class="find-route-btn" @click.stop="loadFavoriteAndFindRoute(favorite)">
            경로 찾기
          </button>
        </div>
      </div>
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

    <CommonModal
        :show="showAlertModal"
        type="alert"
        :title="alertTitle"
        :content="alertContent"
        @close="closeAlertModal"
        @confirm="closeAlertModal"
    />
  </div>
</template>
<script>
import CommonModal from './CommonModal.vue';
import RouteTypeSelector from './RouteTypeSelector.vue';
import '@/css/kicks-map-favorite.css';

export default {
  name: 'KicksMapFavorite',
  components: {CommonModal, RouteTypeSelector},
  emits: ['load-favorite', 'draw-route', 'add-stores'],
  data() {
    return {
      favoriteCourses: [],
      selectedType: 'optimal',
      useCurrentLocation: true,
      currentLocation: null,
      showRouteModal: false,
      routeModalContent: '',
      isShowRouteHelpModal: false,
      showAlertModal: false,
      alertTitle: '',
      alertContent: '',
      currentStores: [],
      currentCourseName: null,
      collapsedFavorites: {} // 접힌 즐겨찾기 상태 관리
    }
  },
  watch: {
  
  },
  methods: {
    loadFavoritesFromStorage() {
      const stored = localStorage.getItem('favoriteCourse');
      this.favoriteCourses = stored ? JSON.parse(stored) : [];
    },
    loadFavorite(favorite) {
      this.$emit('load-favorite', favorite);
    },
    selectType(type) {
      this.selectedType = type;
    },
    changeCurrentStores(favorite) {
      this.currentStores = favorite.stores;
      this.currentCourseName = favorite.favoriteCourseName;
      // KicksMap.vue의 selectedStores에 반영
      this.$emit('add-stores', favorite.stores);
    },
    loadFavoriteAndFindRoute(favorite) {
      // 즐겨찾기 로드
      this.changeCurrentStores(favorite);
      // 경로 찾기 실행
      this.findRoute();
    },
    async findRoute() {
      if (this.useCurrentLocation && !this.currentLocation) {
        this.showAlert('위치 오류', '현재 위치 정보를 가져올 수 없습니다.');
        return;
      }
      if (!this.currentStores || this.currentStores.length === 0) {
        this.showAlert('경로 오류', '경로에 추가된 매장이 없습니다.');
        return;
      }
      // this.currentStores를 selectedStores에 추가하도록 emit
      this.$emit('add-stores', this.currentStores);

      let coords = null;
      let url = null;

      if (this.selectedType === 'sequential') {
        // 순차 검색: 선택된 순서대로 방문
        if (this.useCurrentLocation) {
          coords = this.currentLocation.lon + ',' + this.currentLocation.lat + ';' + this.currentStores.map(store => `${store.lon},${store.lat}`).join(';');
        } else {
          coords = this.currentStores.map(store => `${store.lon},${store.lat}`).join(';');
        }
        url = `https://router.project-osrm.org/route/v1/foot/${coords}?overview=full&geometries=polyline`;
      } else if (this.selectedType === 'optimal') {
        // 최적경로: 가장 효율적인 순서로 방문
        if (this.useCurrentLocation) {
          coords = this.currentLocation.lon + ',' + this.currentLocation.lat + ';' + this.currentStores.map(store => `${store.lon},${store.lat}`).join(';');
        } else {
          coords = this.currentStores.map(store => `${store.lon},${store.lat}`).join(';');
        }
        url = `https://router.project-osrm.org/trip/v1/foot/${coords}?roundtrip=false&source=first&destination=any&overview=full&geometries=polyline`;
      } else {
        // 도착지 고정: 마지막 스토어를 목적지로 고정
        if (this.useCurrentLocation) {
          coords = this.currentLocation.lon + ',' + this.currentLocation.lat + ';' + this.currentStores.map(store => `${store.lon},${store.lat}`).join(';');
        } else {
          coords = this.currentStores.map(store => `${store.lon},${store.lat}`).join(';');
        }
        url = `https://router.project-osrm.org/trip/v1/foot/${coords}?roundtrip=false&source=first&destination=last&overview=full&geometries=polyline`;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.code === 'Ok') {
          let routeData = null;
          let wayPoints = data.waypoints;

          if (this.selectedType === 'sequential') {
            // 순차 검색의 경우 routes 배열 사용
            if (data.routes && data.routes.length > 0) {
              routeData = data.routes[0];
              
              // 순차 검색일 때는 waypoint에 waypoint_index 추가 (currentStores 순서대로)
              if (wayPoints && this.currentStores && this.currentStores.length > 0) {
                wayPoints = wayPoints.map((waypoint, index) => {
                  return {
                    ...waypoint,
                    waypoint_index: index
                  };
                });
              }
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
          this.showAlert('경로 오류', '경로를 찾을 수 없습니다.');
        }
      } catch (e) {
        this.showAlert('경로 오류', '경로 탐색 실패');
        console.error(e);
      }
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
    deleteFavorite(index) {
      if (confirm('이 즐겨찾기를 삭제하시겠습니까?')) {
        this.favoriteCourses.splice(index, 1);
        localStorage.setItem('favoriteCourse', JSON.stringify(this.favoriteCourses));
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    handleCurrentLocationToggle() {
      if (this.useCurrentLocation && !this.currentLocation) {
        this.showAlert('위치 권한 필요', '현재 위치를 사용하려면 브라우저에서 위치 권한을 허용해주세요. 브라우저 주소창 옆의 위치 아이콘을 클릭하여 권한을 허용할 수 있습니다.');
        this.useCurrentLocation = false;
        return;
      }
    },
    toggleFavoriteCollapse(index) {
      this.collapsedFavorites[index] = !this.collapsedFavorites[index];
    },
    isFavoriteCollapsed(index) {
      return this.collapsedFavorites[index] !== undefined ? this.collapsedFavorites[index] : true;
    }
  },
  mounted() {
    this.loadFavoritesFromStorage();

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