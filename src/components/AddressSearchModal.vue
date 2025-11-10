<script>
import '@/css/address-search-modal.css'

export default {
  name: 'AddressSearchModal',
  data() {
    return {
      searchKeyword: '',
      addressList: [],
      addressSearchTimeout: null,
      hasSearched: false
    }
  },
  methods: {
    searchAddress() {
      if (this.searchKeyword.trim()) {
        this.hasSearched = true
        this.getApi(`/stores/address/${this.searchKeyword}`, null, this.searchAddressSuccess, this.searchAddressFail)
      } else {
        this.addressList = []
        this.hasSearched = false
      }
    },
    handleKeyPress(e) {
      if (e.key === 'Enter') {
        this.searchAddress()
      }
    },
    searchAddressSuccess(res) {
      this.addressList = res.data
      this.hasSearched = true
    },
    searchAddressFail(error) {
      console.error('Address search failed:', error)
      this.addressList = []
      this.hasSearched = true
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
  <div class="address-modal-overlay" @click="closeModal">
    <div class="address-modal-container" @click.stop>
      <div class="address-modal-header">
        <h2>주소 검색</h2>
      </div>
      <div class="address-modal-body">
        <div class="address-search-input-container">
          <div class="address-search-input-wrapper">
            <input 
              type="text" 
              v-model="searchKeyword" 
              @keypress="handleKeyPress"
              placeholder="주소나 매장명을 입력하세요"
              class="address-search-input"
            />
            <button class="address-search-btn" @click="searchAddress">검색</button>
          </div>
        </div>
        
        <!-- 검색 결과가 있을 때 -->
        <div v-if="addressList.length > 0" class="address-result-list">
          <div 
            v-for="address in addressList" 
            :key="address.roadAddress" 
            @click="selectAddress(address)"
            class="address-result-item"
          >
            <div class="address-store-name">{{ address.storeName }}</div>
            <div class="address-info-block">
              <div class="address-label">지번주소</div>
              <div class="address-text">{{ address.address }}</div>
            </div>
            <div class="address-info-block">
              <div class="address-label">도로명주소</div>
              <div class="address-text">{{ address.roadAddress }}</div>
            </div>
          </div>
        </div>
        
        <!-- 검색 결과가 없을 때 -->
        <div v-else-if="hasSearched && addressList.length === 0" class="address-no-results">
          <div class="address-no-results-icon">🔍</div>
          <div class="address-no-results-message">검색 결과가 없습니다</div>
          <div class="address-no-results-hint">다른 키워드로 검색해보세요</div>
        </div>
        
        <!-- 검색 전 상태 -->
        <div v-else-if="!hasSearched" class="address-search-guide">
          <div class="address-search-icon">📍</div>
          <div class="address-search-message">주소나 매장명을 검색해보세요</div>
        </div>
      </div>
      <div class="address-modal-footer">
        <button class="address-close-btn" @click="closeModal">닫기</button>
      </div>
    </div>
  </div>
</template>

