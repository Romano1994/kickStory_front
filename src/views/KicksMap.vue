<script>
import L from 'leaflet'
import RegisterModal from '@/components/RegisterModal.vue'
import KicksMapStore from '@/components/KicksMapStore.vue'
import KicksMapRoute from '@/components/KicksMapRoute.vue'
import KicksMapFavorite from '@/components/KicksMapFavorite.vue'

export default {
  name: "KicksMap",
  components: {
    RegisterModal,
    KicksMapStore,
    KicksMapRoute,
    KicksMapFavorite
  },
  data() {
    return {
      map: null,
      marker: null,
      icon: null,
      storeIcon: null,
      activeStoreIcon: null,
      showRegisterModal: false,
      branchType: '00030001', // 추가: 기본값은 오프라인
      countryList: [], // 국가별 갯수 리스트
      selectedCountry: '', // 선택된 국가
      regionList: [], // 지역별 매장 수 리스트
      activeNavIndex: 0,
      navList: [
        {itemNm: "쇼핑코스", imgSrc: "/assets/map/route.png"},
        {itemNm: "발매처", imgSrc: "/assets/map/store.png"},
        {itemNm: "즐겨찾기", imgSrc: "/assets/map/favorite.png"},
      ],
      expandedCities: {},
      expandedDistricts: {},
      activeStore: null,
      storeMarkers: [],
      routePolyline: null // 경로 폴리라인
    }
  },
  computed: {
    currentContentComponent() {
      return [
        'KicksMapStore',
        'KicksMapRoute',
        'KicksMapFavorite'
      ][this.activeNavIndex]
    }
  },
  watch: {
    // selectedCountry가 변경될 때 지역별 매장 수 조회
    selectedCountry(newCountry) {
      if (newCountry) {
        this.getRegionCount(newCountry)
      }
    }
  },
  methods: {
    openRegisterModal() {
      this.showRegisterModal = true
    },
    closeRegisterModal() {
      this.showRegisterModal = false
    },
    // 추가: 탭 변경 메서드
    changeTab(type) {
      this.branchType = type
    },
    // 추가: 국가별 갯수 조회 메서드
    getCountryCount() {
      this.getApi('/store/offline/countries/count', null, this.getCountryCountSuccess, this.getCountryCountFail)
    },
    getCountryCountSuccess(res) {
      this.countryList = res.data
      // 첫 번째 국가를 기본 선택으로 설정
      if (this.countryList.length > 0) {
        this.selectedCountry = this.countryList[0].cntryCd
      }
    },
    getCountryCountFail(error) {
      console.error('Country count fetch failed:', error)
      this.countryList = []
    },
    // 추가: 지역별 매장 수 조회 메서드
    getRegionCount(cntryCd) {
      this.getApi('/store/offline/country/regions/count', { cntryCd }, this.getRegionCountSuccess, this.getRegionCountFail)
    },
    getRegionCountSuccess(res) {
      this.regionList = res.data
    },
    getRegionCountFail(error) {
      console.error('Region count fetch failed:', error)
      this.regionList = []
    },
    toggleCity(city) {
      this.expandedCities[city] = !this.expandedCities[city]
    },
    toggleDistrict(district) {
      this.expandedDistricts[district] = !this.expandedDistricts[district]
    },
    onStoreClick(store) {
      this.activeStore = store.branchNm;
      if (store.lat && store.lon && this.map) {
        this.map.setView([store.lat, store.lon]);
      }
      this.addStoreMarkers(); // 마커 리프레시
    },
    addStoreMarkers() {
      if (!this.regionList) return;
      // 기존 매장 마커 제거 (중복 방지)
      if (this.storeMarkers) {
        this.storeMarkers.forEach(m => this.map.removeLayer(m));
      }
      this.storeMarkers = [];
      this.regionList.forEach(city => {
        city.admSggList.forEach(district => {
          district.offlineBranchList.forEach(store => {
            let icon = this.storeIcon;
            if (this.activeStore === store.branchNm) {
              icon = this.activeStoreIcon;
            }
            const marker = L.marker([store.lat, store.lon], { icon })
              .addTo(this.map)
              .bindPopup(`${store.storeKorNm} ${store.branchNm}`);
            marker.on('click', () => {
              this.onStoreMarkerClick(store, district, city);
            });
            this.storeMarkers.push(marker);
          });
        });
      });
    },
    onStoreMarkerClick(store, district, city) {
      this.expandedCities = { ...this.expandedCities, [city.admSidoNm]: true };
      this.expandedDistricts = { ...this.expandedDistricts, [district.admRginCd]: true };
      this.activeStore = store.branchNm;
      this.map.setView([store.lat, store.lon], 16);
      this.addStoreMarkers();
    },
    onDrawRoute(coordsArr) {
      // coordsArr: [[lat, lng], ...]
      if (this.routePolyline) {
        this.map.removeLayer(this.routePolyline);
        this.routePolyline = null;
      }
      // Leaflet은 [lat, lng] 순서 필요
      this.routePolyline = L.polyline(coordsArr, {
        color: '#2a7a7f', // 진한 청록
        weight: 6,
        opacity: 0.85
      }).addTo(this.map);
      // 경로가 보이도록 지도 영역 fit
      this.map.fitBounds(this.routePolyline.getBounds(), { padding: [30, 30] });
    },
    // onStoreMore(store) {
    //   // TODO: 더보기 버튼 클릭 시 동작 구현
    // }
  },
  mounted() {
    // 국가별 갯수 조회
    this.getCountryCount()
    
    //map 객체 반환
    //[coordinate],zoom level
    this.map = L.map('map', {
      zoomControl: false
    }).setView([37.547809, 126.979914], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
    // Zoom control을 우하단에 추가
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // 현재 위치로 이동 버튼 커스텀 컨트롤 추가
    const locateBtn = L.control({ position: 'bottomright' });
    locateBtn.onAdd = (map) => {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      const btn = L.DomUtil.create('a', 'my-locate-btn', container);
      btn.title = '현재 위치로 이동';
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>';
      btn.href = '#';
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              map.setView([lat, lon], 16);
            },
            (error) => {
              console.log(error);
              alert('위치 정보를 가져올 수 없습니다.');
            }
          );
        } else {
          alert('브라우저가 위치 정보를 지원하지 않습니다.');
        }
      };
      return container;
    };
    locateBtn.addTo(this.map);

    // 내 위치 아이콘
    this.icon = L.icon({
      iconUrl: 'assets/map/location-pin.png',
      iconSize: [38, 38],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
    });
    // 매장용 아이콘 (파란색)
    this.storeIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
    });
    // 활성 매장용 아이콘 (더 크게)
    this.activeStoreIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconSize: [40, 65],
      iconAnchor: [20, 65],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [65, 65]
    });

    // 내 위치에 마커 표시
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.marker = L.marker([lat, lon], { icon: this.icon });
          this.marker.addTo(this.map);
          this.map.setView([lat, lon], 13);
          this.addStoreMarkers();
        },
        (error) => {
          // 위치 정보 못 가져오면 기본 위치에 마커
          console.log(error);
          this.marker = L.marker([37.547809, 126.979914], { icon: this.icon });
          this.marker.addTo(this.map);
          this.addStoreMarkers();
        }
      );
    } else {
      // 브라우저가 geolocation 지원 안하면 기본 위치
      this.marker = L.marker([37.547809, 126.979914], { icon: this.icon });
      this.marker.addTo(this.map);
      this.addStoreMarkers();
    }
  }
}
</script>

<template>
  <div class="map-wrapper">
    <div class="navbar">
      <ul class="navbar-list">
        <li class="navbar-item" v-for="(item, idx) in navList" :class="idx === activeNavIndex ? 'active' : ''" :key="item.itemNm" @click="activeNavIndex = idx">
          <div class="nav-icon">
            <img :src="item.imgSrc" :alt="item.itemNm"/>
            <span>{{ item.itemNm }}</span>
          </div>
        </li>
      </ul>
      <div class="content">
        <KicksMapRoute v-if="activeNavIndex === 0" @draw-route="onDrawRoute" />
        <KicksMapStore
          v-if="activeNavIndex === 1"
          :active-store="activeStore"
          v-model:expandedCities="expandedCities"
          v-model:expandedDistricts="expandedDistricts"
          @store-click="onStoreClick"
          @open-register-modal="openRegisterModal"
        />
        <KicksMapFavorite v-if="activeNavIndex === 2" />
      </div>
    </div>
    <div id="map" class="map-container"></div>
    <RegisterModal v-if="showRegisterModal" @close="closeRegisterModal" />
  </div>
</template>

<style scoped>
.map-wrapper {
  display: flex;
  height: calc(100vh - 4rem);
  width: 100%;
  background-color: var(--color2);
  padding: 1rem;
  gap: 1rem;
}

.navbar {
  width: 400px;
  min-width: 400px;
  height: 90vh;
  display: flex;
  gap: 0;
}

.navbar-list {
  width: 60px;
  min-width: 60px;
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: rgb(164, 155, 123);
  display: flex;
  flex-direction: column;
  height: 100%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  flex-shrink: 0;
}

.content {
  background-color: rgb(204, 195, 163);
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  width: calc(100% - 60px);
  max-height: 90vh;
  overflow-y: auto;
}

.navbar-item {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.nav-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.navbar-item img {
  width: 20px;
  height: 20px;
  filter: brightness(0);
}

.navbar-item span {
  color: var(--color1);
  font-size: 0.7rem;
  font-family: var(--main-font);
}

.navbar-item.active {
  background-color: rgb(204, 195, 163);
  border-right: 4px solid var(--color6);
}

.navbar-item.active img {
  filter: brightness(0);
}

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

.online-content {
  background-color: var(--color2);
  border-radius: 8px;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.online-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--color1);
  font-family: var(--main-font);
  font-size: 0.9rem;
}

.map-container {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  min-height: 700px;
  height: 90vh;
}

@media screen and (max-width: 1024px) {
  .map-wrapper {
    height: calc(100vh - 12rem);
    padding: 0.5rem;
    gap: 0.5rem;
  }

  .navbar {
    width: 360px;
    min-width: 360px;
  }
  
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
  .map-wrapper {
    flex-direction: column;
    height: auto;
    padding: 0.5rem;
  }

  .navbar {
    width: 100%;
    min-width: auto;
  }

  .navbar-list {
    border-radius: 8px 0 0 8px;
  }

  .content {
    border-radius: 0 8px 8px 0;
  }

  .map-container {
    height: 400px;
    min-height: auto;
  }
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
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.register-modal > div:first-child {
  background-color: var(--color2);
  border-radius: 8px;
  padding: 1.5rem;
}

.register-modal > div:first-child > div {
  margin-bottom: 1.2rem;
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

.register-modal input {
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

.register-modal input:focus {
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 999;
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

.city-header span.arrow,
.district-header span.arrow {
  margin-right: 0;
}

.my-locate-btn {
  width: 26px;
  height: 26px;
  line-height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-bottom: 1px solid #ccc;
  color: var(--color6);
  text-decoration: none;
  cursor: pointer;
  font: bold 18px 'Lucida Console', Monaco, monospace;
  padding: 0;
  box-sizing: border-box;
}
.my-locate-btn:last-child {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.my-locate-btn:hover {
  background: #e6f7ff;
}
.my-locate-btn svg {
  width: 18px;
  height: 18px;
}
</style>