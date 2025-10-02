<script>
import L from 'leaflet'
import RegisterModal from '@/components/RegisterModal.vue'
import CommonModal from '@/components/CommonModal.vue'
import KicksMapRoute from '@/components/KicksMapRoute.vue'
import KicksMapFavorite from '@/components/KicksMapFavorite.vue'

export default {
  name: "KicksMap",
  components: {
    RegisterModal,
    KicksMapRoute,
    KicksMapFavorite,
    CommonModal
  },
  data() {
    return {
      map: null,
      marker: null,
      icon: null,
      storeIcon: null,
      activeStoreIcon: null,
      selectedStoreIcon: null,
      selectedStoreMarkers: [],
      showRegisterModal: false,
      showCommonModal: false,
      commonModalMessage: '',
      selectedStores: [],
      activeNavIndex: 0,
      offlineStoreType: '00030001',
      navList: [
        {itemNm: "쇼핑코스", imgSrc: "/assets/map/route.png"},
        {itemNm: "즐겨찾기", imgSrc: "/assets/map/favorite.png"},
        {itemNm: "스토어 등록", imgSrc: "/assets/map/store.png"},
        // {itemNm: "문의하기", imgSrc: "/assets/map/qmark.png"},
      ],
      storeMarkers: [],
      routePolyline: null, // 경로 폴리라인
      waypointMarkers: [], // 웨이포인트 마커들
      showContent: true, // content 표시 여부
      contentWidth: 500, // content 너비
      isResizing: false, // 리사이징 중인지 여부
      minContentWidth: 450, // 최소 content 너비 (HTML 깨짐 방지)
      maxContentWidth: 1000, // 최대 content 너비
      regionStoreList: [],
      isMobileMenuOpen: false, // 모바일 메뉴 열림 상태
      // 모바일 바텀시트 상태
      bottomSheetHeight: 20, // 현재 바텀시트 높이 (%). 0~100
      isDraggingSheet: false,
      dragStartY: 0,
      dragCurrentY: 0,
      sheetMin: 3,
      sheetMax: 85,
      isMobileView: false,
    }
  },
  computed: {
    currentContentComponent() {
      return [
        'KicksMapRoute',
        'KicksMapFavorite'
      ][this.activeNavIndex]
    }
  },

  methods: {
    openRegisterModal() {
      this.showRegisterModal = true
    },
    closeRegisterModal() {
      this.showRegisterModal = false
      // RegisterModal이 닫힐 때 KicksMapRoute의 데이터 새로고침
      this.$nextTick(() => {
        if (this.activeNavIndex === 0) {
          // KicksMapRoute 컴포넌트가 활성화되어 있을 때만 새로고침
          const kicksMapRoute = this.$refs.kicksMapRoute;
          if (kicksMapRoute && kicksMapRoute.getCountryCount) {            
            kicksMapRoute.getCountryCount();
          }
        }
      });
    },
    onStoreClick(store) {
      if (store.lat && store.lon && this.map) {
        this.map.setView([store.lat, store.lon]);
      }
      this.addStoreMarkers(); // 마커 리프레시
    },
    addStoreMarkers() {
      if (!this.regionStoreList || !this.map) return;
      // 기존 매장 마커 제거 (중복 방지)
      if (this.storeMarkers) {
        this.storeMarkers.forEach(m => this.map.removeLayer(m));
      }
      this.storeMarkers = [];
      this.regionStoreList.forEach(city => {
        city.admSggList.forEach(district => {
          district.offlineBranchList.forEach(store => {
            //TODO : 팝업샵 선택된 경로 전체 활성화 오류 수정 필요
            const isSelected = this.offlineStoreType != "00030003" ? Array.isArray(this.selectedStores) && this.selectedStores.some(s => s.branchCd === store.branchCd) :
                Array.isArray(this.selectedStores) && this.selectedStores.some(s => s.storeCd === store.storeCd);
            let icon = this.storeIcon;
            if (isSelected) {
              icon = this.selectedStoreIcon;
            }

            const marker = L.marker([store.lat, store.lon], {icon, zIndexOffset: isSelected ? 900 : 0})
                .addTo(this.map)
            // .bindPopup(`${store.storeKorNm} ${store.branchNm}`);
            marker.on('click', () => {
              this.onStoreMarkerClick(store, district, city);
            });
            this.storeMarkers.push(marker);
          });
        });
      });
    },
    addSelectedStoreMarkers() {
      if (!this.map) return;
      if (this.selectedStoreMarkers) {
        this.selectedStoreMarkers.forEach(m => this.map.removeLayer(m));
      }
      this.selectedStoreMarkers = [];
      if (!Array.isArray(this.selectedStores)) return;
      this.selectedStores.forEach(store => {
        if (store.lat && store.lon) {
          const marker = L.marker([store.lat, store.lon], {icon: this.selectedStoreIcon, zIndexOffset: 2000})
              .addTo(this.map)
              .bindPopup(`${store.storeKorNm} ${store.branchNm}`);
          marker.setZIndexOffset(2000);
          this.selectedStoreMarkers.push(marker);
        }
      });
    },
    onStoreMarkerClick(store, district, city) {
      this.expandedCities = {...this.expandedCities, [city.admSidoNm]: true};
      this.expandedDistricts = {...this.expandedDistricts, [district.admRginCd]: true};
      this.map.setView([store.lat, store.lon], 16);
      this.addStoreMarkers();
      if (this.offlineStoreType != "00030003") {
        this.activeStore = store.branchCd;
      } else {
        this.activeStore = store.storeCd;
      }
    },
    onDrawRoute(coordsArr, wayPoints) {

      // 기존 경로 폴리라인 제거
      if (this.routePolyline) {
        this.map.removeLayer(this.routePolyline);
        this.routePolyline = null;
      }

      // 기존 웨이포인트 마커들 제거
      this.clearWaypointMarkers();

      // Leaflet은 [lat, lng] 순서 필요
      this.routePolyline = L.polyline(coordsArr, {
        color: '#2a7a7f', // 진한 청록
        weight: 6,
        opacity: 0.85
      }).addTo(this.map);

      // 웨이포인트 마커들 추가
      if (wayPoints && Array.isArray(wayPoints)) {
        wayPoints.forEach((waypoint) => {
          // location 배열에서 [경도, 위도] -> [위도, 경도]로 변환
          const lat = waypoint.location[1];
          const lng = waypoint.location[0];

          const waypointMarker = L.marker([lat, lng], {
            icon: this.createNumberedIcon(waypoint.waypoint_index + 1),
            zIndexOffset: 10000
          }).addTo(this.map);

          // 팝업에 웨이포인트 정보 표시
          waypointMarker.bindPopup(`
            <div>
              <strong>경유지 ${waypoint.waypoint_index + 1}</strong><br>
              ${waypoint.name}<br>
              <small>거리: ${waypoint.distance.toFixed(2)}m</small>
            </div>
          `);

          this.waypointMarkers.push(waypointMarker);
        });
      }

      // 경로가 보이도록 지도 영역 fit
      this.map.fitBounds(this.routePolyline.getBounds(), {padding: [30, 30]});
    },
    // 숫자가 표시된 웨이포인트 마커 아이콘 생성
    createNumberedIcon(number) {
      return L.divIcon({
        className: 'waypoint-marker',
        html: `<div class="waypoint-number">${number}</div>`,
        iconSize: [35, 35],
        iconAnchor: [17, 17],
        popupAnchor: [0, -17]
      });
    },
    // 웨이포인트 마커들 제거
    clearWaypointMarkers() {
      if (this.waypointMarkers && this.waypointMarkers.length > 0) {
        this.waypointMarkers.forEach(marker => {
          if (this.map) {
            this.map.removeLayer(marker);
          }
        });
        this.waypointMarkers = [];
      }
    },
    clearAllMarkersAndResetLocation() {
      if (!this.map) return;

      // 모든 매장 마커 제거
      if (this.storeMarkers) {
        this.storeMarkers.forEach(marker => this.map.removeLayer(marker));
        this.storeMarkers = [];
      }

      // 선택된 매장 마커 제거
      if (this.selectedStoreMarkers) {
        this.selectedStoreMarkers.forEach(marker => this.map.removeLayer(marker));
        this.selectedStoreMarkers = [];
      }

      // 웨이포인트 마커 제거
      this.clearWaypointMarkers();

      // 경로 폴리라인 제거
      if (this.routePolyline) {
        this.map.removeLayer(this.routePolyline);
        this.routePolyline = null;
      }

      // 현재 위치 마커 제거 후 재설정
      if (this.marker) {
        this.map.removeLayer(this.marker);
        this.marker = null;
      }

      // 현재 위치 재설정
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              this.marker = L.marker([lat, lon], {icon: this.icon});
              this.marker.addTo(this.map);
              this.map.setView([lat, lon], 13);
            },
            () => {
              // 위치 정보 못 가져오면 기본 위치에 마커
              this.marker = L.marker([37.566734, 126.978236], {icon: this.icon});
              this.marker.addTo(this.map);
              this.map.setView([37.566734, 126.978236], 13);
            }
        );
      } else {
        // 브라우저가 geolocation 지원 안하면 기본 위치
        this.marker = L.marker([37.547809, 126.979914], {icon: this.icon});
        this.marker.addTo(this.map);
        this.map.setView([37.547809, 126.979914], 13);
      }
    },
    onTabChange(idx) {
      const isMobile = this.isMobileView;
      const itemName = this.navList[idx] && this.navList[idx].itemNm;

      // 특별한 기능들 처리 - 이름 기반으로 안전 처리
      if (itemName === '스토어 등록') {
        this.openRegisterModal();
        this.isMobileMenuOpen = false;
        return;
      }
      if (itemName === '내 위치') {
        this.goToCurrentLocation();
        this.isMobileMenuOpen = false;
        return;
      }
      if (itemName === '문의하기') {
        this.commonModalMessage = '문의해 주셔서 감사합니다. 메일: support@kickstory.example 또는 커뮤니티에서 문의를 남겨주세요.';
        this.showCommonModal = true;
        this.isMobileMenuOpen = false;
        return;
      }

      if (isMobile) {
        this.activeNavIndex = idx;
        this.isMobileMenuOpen = false; // 메뉴 선택 후 닫기
        // 바텀시트 열기
        this.openSheetIfNeeded();
      } else {
        // 데스크톱에서는 기존 로직 유지 (탭 컨텐츠는 쇼핑코스/즐겨찾기만)
        if (idx < 2) {
          if (this.activeNavIndex === idx) {
            this.showContent = !this.showContent;
          } else {
            this.activeNavIndex = idx;
            this.showContent = true;
          }
        }
      }

      // map 재렌더링
      this.$nextTick(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      });
    },
    goToCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              this.map.setView([lat, lon], 16);
            },
            () => {
              this.commonModalMessage = '현재 위치를 가져올 수 없습니다.';
              this.showCommonModal = true;
            }
        );
      } else {
        this.commonModalMessage = '위치 서비스를 지원하지 않는 브라우저입니다.';
        this.showCommonModal = true;
      }
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false;
    },
    closeOverlay() {
      // 모바일에서는 closeOverlay 비활성화 (항상 content 표시)
      const isMobile = window.innerWidth <= 768;

      if (!isMobile && this.showContent) {
        this.showContent = false;
        this.$nextTick(() => {
          if (this.map) {
            this.map.invalidateSize();
          }
        });
      }
    },
    handleUpdateregionStoreList(list) {
      this.regionStoreList = list || [];
      this.addStoreMarkers();
      this.addSelectedStoreMarkers();
    },
    handleAddStore(store) {
      if (this.offlineStoreType != "00030003" && !this.selectedStores.find(s => s.branchCd === store.branchCd)) {
        this.selectedStores.push({offlineStoreType: this.offlineStoreType, ...store});
      } else if (this.offlineStoreType == "00030003" && !this.selectedStores.find(s => s.storeCd === store.storeCd)) {
        this.selectedStores.push({offlineStoreType: this.offlineStoreType, ...store});
      }
    },
    handleRemoveStore(store) {
      this.selectedStores = this.selectedStores.filter(s => s.branchCd !== store.branchCd);
    },
    handleStoreTypeChange(newType) {
      this.offlineStoreType = newType;
      // Reset active store when type changes
      this.activeStore = null;
      this.addStoreMarkers();
      this.addSelectedStoreMarkers();
    },
    handleAddStores(stores) {
      // 기존 selectedStores 초기화 후 새로운 stores 추가
      this.selectedStores = [];
      stores.forEach(store => {
        this.selectedStores.push(store);
      });
      this.addSelectedStoreMarkers();
    },

    startResize(e) {
      this.isResizing = true;
      document.addEventListener('mousemove', this.handleResize);
      document.addEventListener('mouseup', this.stopResize);
      e.preventDefault();
    },

    handleResize(e) {
      if (!this.isResizing) return;

      const newWidth = e.clientX - this.$el.offsetLeft - 60; // navbar 너비(60px) 제외
      const clampedWidth = Math.max(this.minContentWidth, Math.min(this.maxContentWidth, newWidth));
      this.contentWidth = clampedWidth;

      // map 재렌더링
      this.$nextTick(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      });
    },

    stopResize() {
      this.isResizing = false;
      document.removeEventListener('mousemove', this.handleResize);
      document.removeEventListener('mouseup', this.stopResize);
    },

    // =====================
    // 모바일 바텀시트 드래그
    // =====================
    startSheetDrag(e) {
      this.isDraggingSheet = true;
      this.dragStartY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
      this.dragCurrentY = this.dragStartY;
      document.addEventListener('mousemove', this.handleSheetDrag, {passive: false});
      document.addEventListener('mouseup', this.endSheetDrag);
      document.addEventListener('touchmove', this.handleSheetDrag, {passive: false});
      document.addEventListener('touchend', this.endSheetDrag);
      if (e.cancelable) e.preventDefault();
    },
    handleSheetDrag(e) {
      if (!this.isDraggingSheet) return;
      const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
      const deltaY = this.dragStartY - clientY; // 위로 드래그하면 양수
      const vh = window.innerHeight;
      const deltaPercent = (deltaY / vh) * 100;
      let next = this.bottomSheetHeight + deltaPercent;
      next = Math.max(this.sheetMin, Math.min(this.sheetMax, next));
      this.bottomSheetHeight = next;
      this.dragStartY = clientY; // 점진 업데이트로 바운싱 줄임
      if (e.cancelable) e.preventDefault();
    },
    endSheetDrag() {
      if (!this.isDraggingSheet) return;
      this.isDraggingSheet = false;
      // 스냅 포인트 적용 (하단, 중간, 상단)
      const snaps = [this.sheetMin, 30, 60, this.sheetMax];
      let nearest = snaps[0];
      let mind = Math.abs(this.bottomSheetHeight - snaps[0]);
      for (let i = 1; i < snaps.length; i += 1) {
        const d = Math.abs(this.bottomSheetHeight - snaps[i]);
        if (d < mind) {
          mind = d;
          nearest = snaps[i];
        }
      }
      this.bottomSheetHeight = nearest;
      document.removeEventListener('mousemove', this.handleSheetDrag);
      document.removeEventListener('mouseup', this.endSheetDrag);
      document.removeEventListener('touchmove', this.handleSheetDrag);
      document.removeEventListener('touchend', this.endSheetDrag);
    },
    // 탭 전환 시 콘텐츠만 변경하고, 바텀시트는 적당히 열기
    openSheetIfNeeded() {
      if (this.bottomSheetHeight < 30) this.bottomSheetHeight = 60;
    },
    minimizeSheet() {
      this.bottomSheetHeight = this.sheetMin;
    },
    maximizeSheet() {
      this.bottomSheetHeight = this.sheetMax;
    },
  },
  mounted() {
    //map 객체 반환
    //[coordinate],zoom level
    this.map = L.map('map', {
      zoomControl: false
    }).setView([37.547809, 126.979914], 13);

    // Leaflet map의 z-index를 낮춤
    const mapContainer = this.map.getContainer();
    if (mapContainer) {
      mapContainer.style.zIndex = '1';
    }
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
    // Zoom control을 우하단에 추가
    L.control.zoom({position: 'bottomright'}).addTo(this.map);

    // 현재 위치로 이동 버튼 커스텀 컨트롤 추가
    const locateBtn = L.control({position: 'bottomright'});
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
              () => {
                this.commonModalMessage = '지도를 구성하던 중 오류가 발생하였습니다.';
                this.showCommonModal = true;
              }
          );
        } else {
          alert('브라우저가 위치 정보를 지원하지 않습니다.');
        }
      };
      return container;
    };
    locateBtn.addTo(this.map);

    // 내 위치 아이콘 (빨간색 마커)
    this.icon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
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
    // 선택된 매장용 아이콘 (초록색)
    this.selectedStoreIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
    });

    // 내 위치에 마커 표시
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            this.marker = L.marker([lat, lon], {icon: this.icon});
            this.marker.addTo(this.map);
            this.map.setView([lat, lon], 13);
            this.addStoreMarkers();
            this.addSelectedStoreMarkers();
          },
          () => {
            // 위치 정보 못 가져오면 기본 위치에 마커
            this.commonModalMessage = '현재 위치를 가져오지 못하였습니다.';
            this.showCommonModal = true;
            this.marker = L.marker([37.566734, 126.978236], {icon: this.icon});
            this.marker.addTo(this.map);
            this.addStoreMarkers();
            this.addSelectedStoreMarkers();
          }
      );
    } else {
      // 브라우저가 geolocation 지원 안하면 기본 위치
      this.marker = L.marker([37.547809, 126.979914], {icon: this.icon});
      this.marker.addTo(this.map);
      this.addStoreMarkers();
    }

    // 반응형 플래그 초기화 및 리스너 등록
    const updateIsMobile = () => {
      this.isMobileView = window.innerWidth <= 768;
    };
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);

    // map 로드 완료 후 content가 제대로 보이도록 보장
    this.$nextTick(() => {
      if (this.showContent) {
        // content가 보여야 하는 상태라면 강제로 다시 표시
        this.showContent = false;
        this.$nextTick(() => {
          this.showContent = true;
        });
      }
    });
    // 저장: 언마운트에서 해제 위해 참조 보관
    this._updateIsMobile = updateIsMobile;
  },
  watch: {
    selectedStores: {
      handler() {
        this.addStoreMarkers();
        this.addSelectedStoreMarkers();
      },
      deep: true
    },
    activeNavIndex: {
      handler() {
        this.clearAllMarkersAndResetLocation();
      }
    }
  },
  beforeUnmount() {
    // 이벤트 리스너 정리
    document.removeEventListener('mousemove', this.handleResize);
    document.removeEventListener('mouseup', this.stopResize);
    if (this._updateIsMobile) window.removeEventListener('resize', this._updateIsMobile);

    // 웨이포인트 마커들 정리
    this.clearWaypointMarkers();
  }
}
</script>

<template>
  <div class="map-wrapper">
    <div class="navbar">
      <!-- 데스크톱 네비게이션 -->
      <ul class="navbar-list desktop-nav">
        <li class="navbar-item" v-for="(item, idx) in navList" :class="idx === activeNavIndex ? 'active' : ''"
            :key="item.itemNm" @click="onTabChange(idx)">
          <div class="nav-icon">
            <img :src="item.imgSrc" :alt="item.itemNm"/>
            <span>{{ item.itemNm }}</span>
          </div>
        </li>
      </ul>

      <!-- 모바일 햄버거 메뉴 -->
      <div class="mobile-nav">
        <button class="hamburger-btn" @click="toggleMobileMenu" :class="{ active: isMobileMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <!-- 모바일 드롭다운 메뉴 -->
        <div class="mobile-dropdown" v-show="isMobileMenuOpen" @click.stop>
          <div class="mobile-menu-item"
               v-for="(item, idx) in navList"
               :key="item.itemNm"
               :class="idx === activeNavIndex ? 'active' : ''"
               @click="onTabChange(idx)">
            <img :src="item.imgSrc" :alt="item.itemNm"/>
            <span>{{ item.itemNm }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="map-container">
      <div id="map"></div>
      <div class="map-legend">
        <div class="legend-item">
          <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png"
               alt="현재 위치"/>
          <span>현재 위치</span>
        </div>
        <div class="legend-item">
          <img class="legend-item" src="https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png" alt="활성 매장"/>
          <span>지역별 스토어</span>
        </div>
        <div class="legend-item">
          <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png"
               alt="선택된 매장"/>
          <span>선택된 경로</span>
        </div>
      </div>
      <!-- 데스크톱 content-overlay -->
      <div class="content-overlay desktop-content" v-show="showContent" @click="closeOverlay">
        <div class="content" :style="{ width: contentWidth + 'px' }" @click.stop>
          <div class="resize-handle" @mousedown="startResize"></div>
          <KicksMapRoute
              ref="kicksMapRoute"
              v-if="activeNavIndex === 0"
              :selected-stores="selectedStores"
              :offline-store-type="offlineStoreType"
              @open-register-modal="openRegisterModal"
              @draw-route="onDrawRoute"
              @update-region-list="handleUpdateregionStoreList"
              @store-type-change="handleStoreTypeChange"
              @add-store="handleAddStore"
              @remove-store="handleRemoveStore"
          />
          <KicksMapFavorite v-if="activeNavIndex === 1" @add-stores="handleAddStores" @draw-route="onDrawRoute"/>
        </div>
      </div>

      <!-- 모바일 바텀시트: 하단 도킹 + 드래그로 열기/닫기 -->
      <div class="mobile-bottom-sheet" v-show="isMobileView" :class="{ 'is-minimized': bottomSheetHeight <= sheetMin + 0.1 }" :style="{ height: bottomSheetHeight + '%' }">
        <div class="sheet-grabber" @mousedown="startSheetDrag" @touchstart="startSheetDrag">
          <div class="grabber-bar"></div>
        </div>
        <div class="sheet-header">
          <div class="sheet-title">{{ navList[activeNavIndex]?.itemNm || '메뉴' }}</div>
          <div class="sheet-actions">
            <button class="sheet-btn" @click.stop="minimizeSheet" title="내리기">▾</button>
            <button class="sheet-btn" @click.stop="maximizeSheet" title="올리기">▴</button>
          </div>
        </div>
        <div class="sheet-content" @mousedown.stop @touchstart.stop>
          <KicksMapRoute
              ref="kicksMapRoute"
              v-if="activeNavIndex === 0"
              :selected-stores="selectedStores"
              :offline-store-type="offlineStoreType"
              @open-register-modal="openRegisterModal"
              @draw-route="onDrawRoute"
              @update-region-list="handleUpdateregionStoreList"
              @store-type-change="handleStoreTypeChange"
              @add-store="handleAddStore"
              @remove-store="handleRemoveStore"
          />
          <KicksMapFavorite v-if="activeNavIndex === 1" @add-stores="handleAddStores" @draw-route="onDrawRoute"/>
        </div>
      </div>
    </div>
    <RegisterModal v-if="showRegisterModal" :initial-offline-store-type="offlineStoreType" @close="closeRegisterModal"/>
    <CommonModal
        :show="showCommonModal"
        :content="commonModalMessage"
        type="alert"
        @close="showCommonModal = false"
        @confirm="showCommonModal = false"
    />
  </div>
</template>

<style scoped>
@import '../css/map.css';
</style>