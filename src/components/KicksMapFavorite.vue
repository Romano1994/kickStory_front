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
          <input type="checkbox" v-model="useCurrentLocation" class="toggle-checkbox">
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
          <h3 class="favorite-name">{{ favorite.favoriteCourseName }}</h3>
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
        <div class="favorite-info">
          <span class="store-count">스토어 {{ favorite.stores.length }}개</span>
          <span class="created-date">{{ formatDate(favorite.createdAt) }}</span>
        </div>
        <div class="store-preview">
          <div
              v-for="(store, storeIndex) in favorite.stores.slice(0, 3)"
              :key="storeIndex"
              class="store-preview-item"
          >
            <span class="store-order">{{ storeIndex + 1 }}</span>
            <span class="store-name">{{ store.storeKorNm }} {{ store.branchNm || '' }}</span>
          </div>
          <div v-if="favorite.stores.length > 3" class="more-stores">
            +{{ favorite.stores.length - 3 }}개 더
          </div>
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
    }
  },
  watch: {
    selectedType: {
      handler() {
        if (Array.isArray(this.currentStores) && this.currentStores.length > 0) {
          this.findRoute();
        }
      }
    },
    currentStores: {
      handler() {
        if (Array.isArray(this.currentStores) && this.currentStores.length > 0) {
          this.findRoute();
        }
      },
      deep: true
    },
    useCurrentLocation: {
      handler() {
        if (Array.isArray(this.currentStores) && this.currentStores.length > 0) {
          this.findRoute();
        }
      }
    }
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
      console.log("findRoutes", this.currentStores);

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
<style scoped>
@import '../css/main.css';
@import '../css/map.css';

.favorite-content {
  padding: 1rem;
}

@media (max-width: 768px) {
  .favorite-content {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .favorite-content {
    padding: 0.5rem;
  }
}

.empty-placeholder {
  text-align: center;
  padding: 2rem;
  color: var(--color1);
  font-family: var(--main-font);
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .empty-placeholder {
    padding: 1.5rem;
    border-radius: 10px;
  }
}

@media (max-width: 480px) {
  .empty-placeholder {
    padding: 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
  }
}

.favorite-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 768px) {
  .favorite-list {
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .favorite-list {
    gap: 0.5rem;
  }
}

.favorite-item {
  background: linear-gradient(135deg, var(--color2), rgba(0, 0, 0, 0.8));
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.favorite-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.favorite-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

.favorite-item:hover::before {
  opacity: 1;
}

.favorite-item.active {
  background: linear-gradient(135deg, var(--color6), rgba(54, 150, 156, 0.8));
  border-color: var(--color6);
  box-shadow: 0 8px 25px rgba(54, 150, 156, 0.4);
  transform: translateY(-2px);
}

.favorite-item.active .favorite-name {
  color: #fff;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .favorite-item {
    padding: 1rem;
    border-radius: 10px;
  }

  .favorite-item:hover {
    transform: translateY(-1px);
  }
}

@media (max-width: 480px) {
  .favorite-item {
    padding: 0.75rem;
    border-radius: 8px;
  }
}

.favorite-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  position: relative;
  z-index: 2;
}

@media (max-width: 768px) {
  .favorite-header {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 480px) {
  .favorite-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
}

.favorite-name {
  margin: 0;
  color: var(--color1);
  font-family: var(--sub-font);
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 1.3;
  position: relative;
  z-index: 2;
}

@media (max-width: 768px) {
  .favorite-name {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .favorite-name {
    font-size: 1rem;
    text-align: center;
  }
}

.favorite-actions {
  display: flex;
  gap: 0.5rem;
  position: relative;
  z-index: 2;
}

@media (max-width: 480px) {
  .favorite-actions {
    justify-content: center;
  }
}

.load-btn,
.delete-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.load-btn:hover {
  background: linear-gradient(135deg, var(--color6), rgba(54, 150, 156, 0.8));
  border-color: var(--color6);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(54, 150, 156, 0.4);
}

.delete-btn:hover {
  background: linear-gradient(135deg, rgba(184, 92, 59, 0.9), rgba(164, 72, 39, 0.8));
  border-color: rgba(184, 92, 59, 0.8);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(184, 92, 59, 0.4);
}

@media (max-width: 768px) {
  .load-btn,
  .delete-btn {
    padding: 0.35rem;
    font-size: 1.1rem;
    border-radius: 6px;
  }
}

@media (max-width: 480px) {
  .load-btn,
  .delete-btn {
    padding: 0.3rem;
    font-size: 1rem;
    border-radius: 4px;
  }
}

.favorite-description {
  color: var(--color1);
  font-family: var(--main-font);
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  opacity: 0.9;
  line-height: 1.4;
  position: relative;
  z-index: 2;
}

@media (max-width: 768px) {
  .favorite-description {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 480px) {
  .favorite-description {
    font-size: 0.85rem;
    text-align: center;
  }
}

.favorite-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--color1);
  opacity: 0.8;
  position: relative;
  z-index: 2;
}

@media (max-width: 768px) {
  .favorite-info {
    font-size: 0.85rem;
    margin-bottom: 0.75rem;
  }
}

@media (max-width: 480px) {
  .favorite-info {
    flex-direction: column;
    gap: 0.25rem;
    text-align: center;
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }
}

.store-count {
  font-weight: 600;
  background: linear-gradient(135deg, var(--color6), rgba(54, 150, 156, 0.8));
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

@media (max-width: 480px) {
  .store-count {
    align-self: center;
  }
}

.created-date {
  font-family: var(--main-font);
  font-style: italic;
}

.store-preview {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  z-index: 2;
}

@media (max-width: 768px) {
  .store-preview {
    gap: 0.4rem;
  }
}

@media (max-width: 480px) {
  .store-preview {
    gap: 0.3rem;
  }
}

.store-preview-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.store-preview-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .store-preview-item {
    font-size: 0.85rem;
    padding: 0.25rem 0.4rem;
  }
}

@media (max-width: 480px) {
  .store-preview-item {
    font-size: 0.8rem;
    padding: 0.2rem 0.3rem;
  }
}

.store-order {
  background: linear-gradient(135deg, var(--color6), rgba(54, 150, 156, 0.8));
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  margin-right: 0.75rem;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(54, 150, 156, 0.4);
}

@media (max-width: 768px) {
  .store-order {
    width: 18px;
    height: 18px;
    font-size: 0.7rem;
    margin-right: 0.6rem;
  }
}

@media (max-width: 480px) {
  .store-order {
    width: 16px;
    height: 16px;
    font-size: 0.65rem;
    margin-right: 0.5rem;
  }
}

.store-name {
  color: var(--color1);
  font-family: var(--main-font);
  font-weight: 500;
  flex: 1;
}

.more-stores {
  color: var(--color1);
  font-family: var(--main-font);
  font-size: 0.85rem;
  opacity: 0.7;
  margin-left: 2rem;
  font-style: italic;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .more-stores {
    font-size: 0.8rem;
    margin-left: 1.5rem;
  }
}

@media (max-width: 480px) {
  .more-stores {
    font-size: 0.75rem;
    margin-left: 1rem;
    text-align: center;
  }
}

@media screen and (max-width: 720px) {
  .favorite-content {
    padding: 0.5rem;
  }

  .favorite-item {
    padding: 0.8rem;
  }

  .favorite-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .favorite-actions {
    align-self: flex-end;
  }
}

/* 경로 설정 컨테이너 */
.route-settings-container {
  margin-bottom: 2rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .route-settings-container {
    margin-bottom: 1.5rem;
    padding: 0.75rem;
    border-radius: 10px;
  }
}

@media (max-width: 480px) {
  .route-settings-container {
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 8px;
  }
}

/* 위치 토글 섹션 */
.location-toggle-section {
  display: flex;
  justify-content: center;
  padding: 0.75rem 0;
  margin-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .location-toggle-section {
    padding: 0.5rem 0;
    margin-top: 0.5rem;
  }
}

@media (max-width: 480px) {
  .location-toggle-section {
    padding: 0.4rem 0;
    margin-top: 0.4rem;
  }
}

/* 현재 위치 시작 토글 */
.current-location-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.current-location-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .current-location-toggle {
    gap: 0.6rem;
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
  }
}

@media (max-width: 480px) {
  .current-location-toggle {
    gap: 0.5rem;
    padding: 0.3rem 0.5rem;
    border-radius: 4px;
    flex-direction: column;
    text-align: center;
  }
}

.toggle-checkbox {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 36px;
  height: 18px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 18px;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-slider::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  background-color: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-checkbox:checked + .toggle-slider {
  background: linear-gradient(135deg, var(--color6), rgba(54, 150, 156, 0.8));
  box-shadow: 0 2px 8px rgba(54, 150, 156, 0.4);
}

.toggle-checkbox:checked + .toggle-slider::before {
  transform: translateX(18px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .toggle-slider {
    width: 32px;
    height: 16px;
    border-radius: 16px;
  }

  .toggle-slider::before {
    width: 12px;
    height: 12px;
  }

  .toggle-checkbox:checked + .toggle-slider::before {
    transform: translateX(16px);
  }
}

@media (max-width: 480px) {
  .toggle-slider {
    width: 28px;
    height: 14px;
    border-radius: 14px;
  }

  .toggle-slider::before {
    width: 10px;
    height: 10px;
  }

  .toggle-checkbox:checked + .toggle-slider::before {
    transform: translateX(14px);
  }
}

.toggle-text {
  color: var(--color1);
  font-size: 0.9rem;
  font-family: var(--sub-font);
  white-space: nowrap;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .toggle-text {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .toggle-text {
    font-size: 0.8rem;
    white-space: normal;
    text-align: center;
  }
}

/* 즐겨찾기 헤더 클릭 가능하게 */
.favorite-header {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.favorite-header:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}
</style> 