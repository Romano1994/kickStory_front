<script>
import L from 'leaflet'

export default {
  name: "KicksMap",
  data() {
    return {
      map: null,
      marker: null,
      icon: null,
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
  <div>
    <div id="map" style="height:800px"></div>
  </div>
</template>

<style scoped>

</style>