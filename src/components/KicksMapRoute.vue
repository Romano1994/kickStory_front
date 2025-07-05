<template>
  <div class="route-content">
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
    <div class="location-list">
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
              <li class="store-item" v-for="store in district.offlineBranchList" :key="store.branchNm" @click="handleStoreClick(store)">
                <span>{{ store.storeKorNm }} {{ store.branchNm }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="selected-stores">
      <h5>선택된 경로</h5>
      <ul>
        <li v-for="store in selectedStores" :key="store.branchNm">
          {{ store.storeKorNm }} {{ store.branchNm }}
          <button @click="removeStore(store)">제거</button>
        </li>
      </ul>
      <div v-if="!selectedStores.length" style="color: #aaa; font-size: 0.95rem; padding: 0.5rem 0 0.5rem 0.5rem;">선택된 매장이 없습니다.</div>
    </div>
    <button class="find-route-btn" @click="findRoute">경로 찾기</button>
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
export default {
  name: 'KicksMapRoute',
  components: { CommonModal },
  props: {
    regionList: Array,
    countryList: Array,
    selectedCountry: String,
    expandedCities: Object,
    expandedDistricts: Object
  },
  emits: [
    'update:selectedCountry',
    'update:expandedCities',
    'update:expandedDistricts',
    'draw-route'
  ],
  data() {
    return {
      selectedType: 'optimal',
      selectedStores: [],
      currentLocation: null, // { lat, lon }
      showRouteModal: false,
      routeModalContent: '',
    }
  },
  methods: {
    selectType(type) {
      this.selectedType = type;
      this.$emit('route-type-change', type);
    },
    handleCountryChange(e) {
      this.$emit('update:selectedCountry', e.target.value);
    },
    toggleCity(city) {
      const updated = { ...this.expandedCities, [city]: !this.expandedCities[city] }
      this.$emit('update:expandedCities', updated)
    },
    toggleDistrict(district) {
      const updated = { ...this.expandedDistricts, [district]: !this.expandedDistricts[district] }
      this.$emit('update:expandedDistricts', updated)
    },
    handleStoreClick(store) {
      if (!this.selectedStores.find(s => s.branchNm === store.branchNm)) {
        this.selectedStores.push(store);
      }
    },
    removeStore(store) {
      this.selectedStores = this.selectedStores.filter(s => s.branchNm !== store.branchNm);
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
  mounted() {
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
.route-type-toggle {
  margin-bottom: 1rem;
  display: flex;
  background-color: var(--color2);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: none;
}
.route-type-toggle .btn {
  flex: 1 1 0;
  width: 50%;
  text-align: center;
  border: none;
  background: transparent;
  color: var(--color1);
  font-family: var(--sub-font);
  font-size: 0.98rem;
  padding: 12px 0;
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
.route-type-toggle .btn:focus {
  outline: none;
  background-color: rgba(255,255,255,0.08);
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
.selected-stores {
  background-color: var(--color2);
  border-radius: 8px;
  margin-top: 1rem;
  padding: 1rem 1rem 0.5rem 1rem;
  font-family: var(--main-font);
  font-size: 0.98rem;
  box-shadow: none;
}
.selected-stores h5 {
  margin: 0 0 0.7rem 0;
  color: var(--color1);
  font-family: var(--sub-font);
  font-size: 1.05rem;
  font-weight: bold;
}
.selected-stores ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.selected-stores li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 0.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  color: var(--color1);
  font-size: 0.97rem;
  font-family: var(--main-font);
  background: none;
}
.selected-stores li:last-child {
  border-bottom: none;
}
.selected-stores button {
  margin-left: 1rem;
  padding: 4px 10px;
  background: var(--color6);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s;
}
.selected-stores button:hover {
  background: #2a7a7f;
}
.selected-stores > div {
  color: #aaa;
  font-size: 0.95rem;
  padding: 0.5rem 0 0.5rem 0.5rem;
}
.find-route-btn {
  width: 100%;
  margin-top: 1rem;
  background-color: var(--color6);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: var(--sub-font);
  font-size: 1.05rem;
  font-weight: bold;
  padding: 12px 0;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  box-shadow: none;
  display: block;
}
.find-route-btn:hover {
  background: #2a7a7f;
}
</style> 