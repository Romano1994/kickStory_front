<script>
import '@/css/address-search-modal.css'

export default {
  name: 'AddressSearchModal',
  data() {
    return {
      searchKeyword: '',
      addressList: [],
      addressSearchTimeout: null
    }
  },
  methods: {
    searchAddress() {
      if (this.searchKeyword.trim()) {
        this.getApi(`/store/address/${this.searchKeyword}`, null, this.searchAddressSuccess, this.searchAddressFail)
      } else {
        this.addressList = []
      }
    },
    handleKeyPress(e) {
      if (e.key === 'Enter') {
        this.searchAddress()
      }
    },
    searchAddressSuccess(res) {
      this.addressList = res.data
    },
    searchAddressFail(error) {
      console.error('Address search failed:', error)
      this.addressList = []
    },
    selectAddress(address) {
      this.$emit('select', {
        storeName: address.storeName,
        roadAddress: address.roadAddress,
        address: address.address,
        lon: address.lon,
        lat: address.lat
      })
      this.closeModal()
    },
    closeModal() {
      this.$emit('close')
    }
  },
  beforeUnmount() {
    if (this.addressSearchTimeout) {
      clearTimeout(this.addressSearchTimeout)
    }
  }
}
</script>

<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="address-search-modal" @click.stop>
      <div class="modal-header">
        <h2>주소 검색</h2>
      </div>
      <div class="modal-content">
        <div class="search-input-container">
          <div class="search-input-wrapper">
            <input 
              type="text" 
              v-model="searchKeyword" 
              @keypress="handleKeyPress"
              placeholder="주소나 매장명을 입력하세요"
            />
            <button class="search-button" @click="searchAddress">검색</button>
          </div>
        </div>
        <div v-if="addressList.length > 0" class="search-list">
          <div 
            v-for="address in addressList" 
            :key="address.roadAddress" 
            @click="selectAddress(address)"
            class="search-item"
          >
            <div class="store-name">{{ address.storeName }}</div>
            <div class="store-address">
              <div class="address-type">지번주소</div>
              <div class="address-content">{{ address.address }}</div>
            </div>
            <div class="store-address">
              <div class="address-type">도로명주소</div>
              <div class="address-content">{{ address.roadAddress }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="closeModal">닫기</button>
      </div>
    </div>
  </div>
</template>
