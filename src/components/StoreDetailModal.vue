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
import '@/css/store-detail-modal.css'

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


