<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="modal-title">스토어 정보</h3>
        <!-- <button class="close-btn" @click="$emit('close')">✕</button> -->
      </div>
      <div class="modal-body">
        <template v-if="offlineStoreType === '00030001'">
          <div class="detail-row">
            <span class="label">한글명</span>
            <span class="value">{{ safe(store.storeKorNm) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">영문명</span>
            <span class="value">{{ safe(store.storeEngNm) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">지점명</span>
            <span class="value">{{ safe(store.branchNm) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">설명</span>
            <span class="value">{{ safe(store.shopDescription) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">연락처</span>
            <span class="value">{{ safe(store.contactInfo) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">상태</span>
            <span class="value">{{ statusLabel(store.status) }}</span>
          </div>
        </template>

        <template v-else-if="offlineStoreType === '00030002'">
          <div class="detail-row">
            <span class="label">한글명</span>
            <span class="value">{{ safe(store.storeKorNm) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">영문명</span>
            <span class="value">{{ safe(store.storeEngNm) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">지점명</span>
            <span class="value">{{ safe(store.branchNm) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">설명</span>
            <span class="value">{{ safe(store.shopDescription) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">연락처</span>
            <span class="value">{{ safe(store.contactInfo) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">상태</span>
            <span class="value">{{ statusLabel(store.status) }}</span>
          </div>
        </template>

        <template v-else-if="offlineStoreType === '00030003'">
          <div class="detail-row">
            <span class="label">한글명</span>
            <span class="value">{{ safe(store.storeKorNm) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">영문명</span>
            <span class="value">{{ safe(store.storeEngNm) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">상태</span>
            <span class="value">{{ statusLabel(store.status) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">사용 여부</span>
            <span class="value">{{ useYnLabel(store.useYn) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">운영 기간</span>
            <span class="value">{{ dateRangeLabel(store.strtDt, store.endDt) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">주소</span>
            <span class="value">{{ safe(store.popupAddr) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">도로명주소</span>
            <span class="value">{{ safe(store.popupRoadAddr) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">유료 여부</span>
            <span class="value">{{ feeYnLabel(store.feeYn) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">예약 링크</span>
            <span class="value">
              <template v-if="store.reservationLink">
                <a :href="store.reservationLink" target="_blank" rel="noopener">{{ store.reservationLink }}</a>
              </template>
              <template v-else>-</template>
            </span>
          </div>
          <div class="detail-row">
            <span class="label">설명</span>
            <span class="value">{{ safe(store.description) }}</span>
          </div>
        </template>

        <template v-else>
          <div class="kv-container">
            <div
              v-for="(val, key) in store"
              :key="String(key)"
              class="detail-row"
            >
              <span class="label">{{ key }}</span>
              <span class="value">{{ formatValue(val) }}</span>
            </div>
          </div>
        </template>
      </div>
      <div class="modal-footer">
        <button class="primary-btn" @click="$emit('close')">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StoreDetailModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    store: {
      type: Object,
      default: () => ({})
    },
    offlineStoreType: {
      type: String,
      default: ''
    }
  },
  methods: {
    safe(v) {
      if (v === null || v === undefined || v === '') return '-';
      return v;
    },
    formatValue(v) {
      if (v === null || v === undefined || v === '') return '-';
      if (typeof v === 'object') {
        try {
          return JSON.stringify(v);
        } catch (e) {
          return String(v);
        }
      }
      return String(v);
    },
    statusLabel(v) {
      switch (v) {
        case 'SCHEDULED':
          return '예정';
        case 'ACTIVE':
          return '운영중';
        case 'TEMPORARY_CLOSE':
          return '임시 휴업';
        default:
          return this.safe(v);
      }
    },
    useYnLabel(v) {
      if (v === 'Y') return '사용';
      if (v === 'N') return '미사용';
      return this.safe(v);
    },
    feeYnLabel(v) {
      if (v === 'Y') return '유료';
      if (v === 'N') return '무료';
      return this.safe(v);
    },
    yyyyMmDd(arr) {
      if (!Array.isArray(arr) || arr.length < 3) return '-';
      const [y, m, d] = arr;
      const mm = String(m).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      return `${y}-${mm}-${dd}`;
    },
    dateRangeLabel(startArr, endArr) {
      const s = this.yyyyMmDd(startArr);
      const e = this.yyyyMmDd(endArr);
      if (s === '-' && e === '-') return '-';
      if (s !== '-' && e !== '-') return `${s} ~ ${e}`;
      return s !== '-' ? s : e;
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgb(204, 195, 163);
  width: 90%;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  text-align: center;
}
.modal-title {
  margin: 0 auto;
  font-size: 1.2rem;
  color: var(--color1);
  font-family: var(--main-font);
}
.close-btn {
  background: transparent;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: var(--color3, #666);
}
.modal-body {
  background-color: var(--color2);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 0 1.25rem 1.25rem;
  max-height: 65vh;
  overflow: auto;
  color: var(--color1);
  font-family: var(--main-font);
}
.kv-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}
.detail-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px dashed rgba(0,0,0,0.06);
}
.detail-row .label {
  color: var(--color1);
  font-family: var(--sub-font);
}
.detail-row .value {
  color: var(--color1);
  word-break: break-word;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem 1rem;
}
.primary-btn {
  background: var(--color6);
  color: #fff;
  border: none;
  padding: 8px 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: var(--sub-font);
}
.primary-btn:hover {
  filter: brightness(1.05);
}

@media screen and (max-width: 720px) {
  .modal-container {
    max-width: 95%;
  }
  .modal-body {
    padding: 1rem;
  }
}
</style>

