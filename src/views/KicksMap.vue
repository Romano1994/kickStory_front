<script>
import L from 'leaflet'

export default {
  name: "KicksMap",
  data() {
    return {
      map: null,
      marker: null,
      icon: null,
      navList: [
        {itemNm: "발매처", imgSrc: "/assets/map/store.png", isActive: true},
        {itemNm: "쇼핑코스", imgSrc: "/assets/map/route.png", isActive: false},
        {itemNm: "즐겨찾기", imgSrc: "/assets/map/favorite.png", isActive: false},
      ]
    }
  },
  mounted() {
    //map 객체 반환
    //[coordinate],zoom level
    this.map = L.map('map').setView([37.547809, 126.979914], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.icon = L.icon({
      iconUrl: 'assets/map/location-pin.png',
      iconSize: [38, 38],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
    });

    this.marker = L.marker([37.547809, 126.979914], {
      icon: this.icon
    });
    this.marker.addTo(this.map)
    this.marker.bindPopup("dkssssdafv").openPopup();
  }
}
</script>

<template>
  <div class="map-wrapper">
    <div class="navbar">
      <ul class="navbar-list">
        <li class="navbar-item" v-for="item in navList" :class="item.isActive?'active':''" :key="item.itemNm">
          <div class="nav-icon">
            <img :src="item.imgSrc" :alt="item.itemNm"/>
            <span>{{ item.itemNm }}</span>
          </div>
        </li>
      </ul>
      <div class="content">
        <div class="search-box">
          <div class="search-container">
            <select class="search-select">
              <option>매장별</option>
              <option>지역별</option>
            </select>
            <input type="text" class="search-input" placeholder="검색어를 입력하세요"/>
            <button class="search-btn">검색</button>
          </div>
          <div class="register-container">
            <button class="register-btn">발매처 등록하기</button>
          </div>
        </div>
        <div class="location-list">
          <div class="location-item">
            <div class="city-header">
              <span>서울</span>
              <span class="arrow">></span>
            </div>
            <ul class="store-list">
              <li class="store-item">웍스아웃 압구정</li>
              <li class="store-item">웍스아웃 홍대입구</li>
            </ul>
          </div>
          <div class="location-item">
            <div class="city-header">
              <span>경기도</span>
              <span class="arrow">></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="map" class="map-container"></div>
  </div>
</template>

<style scoped>
.map-wrapper {
  display: flex;
  height: calc(100vh - 15rem);
  width: 100%;
  background-color: var(--color2);
  padding: 1rem;
  gap: 1rem;
}

.navbar {
  width: 400px;
  min-width: 400px;
  height: 100%;
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

.location-list {
  background-color: var(--color2);
  border-radius: 8px;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.location-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.city-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color1);
  cursor: pointer;
  font-family: var(--sub-font);
  font-size: 1rem;
}

.arrow {
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
}

.store-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.map-container {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  min-height: 500px;
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
</style>