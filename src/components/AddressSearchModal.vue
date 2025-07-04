<script>
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

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.address-search-modal {
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

.modal-header {
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  color: var(--color1);
  font-family: var(--main-font);
  font-size: 1.2rem;
  margin: 0;
}

.modal-content {
  background-color: var(--color2);
  border-radius: 8px;
  padding: 1.5rem;
}

.search-input-container {
  margin-bottom: 1rem;
}

.search-input-wrapper {
  display: flex;
  gap: 8px;
}

.search-input-wrapper input {
  flex: 1;
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

.search-input-wrapper input:focus {
  outline: none;
  border-color: var(--color6);
  background-color: rgba(255, 255, 255, 0.15);
}

.search-button {
  padding: 8px 16px;
  background-color: var(--color6);
  color: white;
  border: none;
  border-radius: 4px;
  font-family: var(--sub-font);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.search-button:hover {
  background-color: #2a7a7f;
}

.search-list {
  max-height: 300px;
  overflow-y: auto;
}

.search-item {
  padding: 12px;
  cursor: pointer;
  color: var(--color1);
  font-size: 0.9rem;
  font-family: var(--main-font);
  border-bottom: 1px solid rgba(255, 244, 204, 0.3);
}

.search-item:last-child {
  border-bottom: none;
}

.search-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.store-name {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 12px;
  color: var(--color1);
}

.store-address {
  margin-bottom: 8px;
  padding-left: 4px;
}

.store-address:last-child {
  margin-bottom: 0;
}

.address-type {
  color: rgba(255, 244, 204, 0.7);
  font-size: 0.8rem;
  margin-bottom: 4px;
}

.address-content {
  color: var(--color1);
  font-size: 0.9rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.modal-footer button {
  padding: 8px 1.5rem;
  background-color: var(--color6);
  color: white;
  border: none;
  border-radius: 4px;
  font-family: var(--sub-font);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-footer button:hover {
  background-color: #2a7a7f;
}

@media screen and (max-width: 720px) {
  .address-search-modal {
    width: 95%;
    padding: 1rem;
  }
  
  .modal-content {
    padding: 1rem;
  }
  
  .modal-footer button {
    padding: 8px 1rem;
  }
  
  .search-button {
    padding: 8px 12px;
  }
}
</style> 