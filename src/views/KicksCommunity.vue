<template>
  <div class="community-container" :class="{ 'is-mobile': isMobile }">
    <!-- 헤더 섹션 -->
    <div class="community-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <font-awesome-icon :icon="['fas', 'users']" class="title-icon" />
            커뮤니티
          </h1>
          <p class="page-subtitle">함께 나누는 패션 이야기</p>
        </div>
        <button @click="createPst" class="write-button">
          <font-awesome-icon :icon="['fas', 'pen']" />
          새 글 작성
        </button>
      </div>
    </div>
    <div class="header-cell settings-header">
            <div class="page-size-selector">
              <select v-model="itemsPerPage" class="page-size-select">
                <option :value="10">10개</option>
                <option :value="20">20개</option>
                <option :value="30">30개</option>
              </select>
            </div>
          </div>
    <!-- 게시글 목록 -->
    <div class="posts-section">
      <div class="posts-table">
        <!-- 테이블 헤더 -->
        <div class="table-header">
          <div class="header-cell title-header">
            <font-awesome-icon :icon="['fas', 'file-alt']" class="header-icon" />
            제목
          </div>
          <div class="header-cell author-header">
            <font-awesome-icon :icon="['fas', 'user']" class="header-icon" />
            작성자
          </div>
          <div class="header-cell views-header">
            <font-awesome-icon :icon="['fas', 'eye']" class="header-icon" />
            조회수
          </div>
          <div class="header-cell date-header">
            <font-awesome-icon :icon="['fas', 'clock']" class="header-icon" />
            날짜
          </div>

        </div>
        
        <!-- 테이블 바디 -->
        <div class="table-body">
          <div 
            v-for="item in items" 
            :key="item.id" 
            class="table-row"
            @click="goToDetail(item.pstNo)"
          >
            <div class="table-cell title-cell">
              <div class="title-content">
                <span class="title-text">{{ item.pstTitl }}</span>
                <span v-if="item.cmtCnt > 0" class="comment-badge">
                  <font-awesome-icon :icon="['fas', 'comment']" size="xs" />
                  {{ item.cmtCnt }}
                </span>
              </div>
            </div>
            <div class="table-cell author-cell">
              <div class="author-content">
                <font-awesome-icon :icon="['fas', 'user-circle']" class="cell-icon" />
                {{ item.id }}
              </div>
            </div>
            <div class="table-cell views-cell">
              <div class="views-content">
                <font-awesome-icon :icon="['fas', 'eye']" class="cell-icon" />
                {{ item.pstHit }}
              </div>
            </div>
            <div class="table-cell date-cell">
              <div class="date-content">
                <font-awesome-icon :icon="['fas', 'calendar-alt']" class="cell-icon" />
                {{ formatDate(item.regDtt) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 빈 상태 -->
      <div v-if="items.length === 0" class="empty-state">
        <div class="empty-icon">
          <font-awesome-icon :icon="['fas', 'file-alt']" />
        </div>
        <h3 class="empty-title">아직 게시글이 없어요</h3>
        <p class="empty-text">첫 번째 게시글을 작성해보세요!</p>
        <button @click="createPst" class="empty-action-button">
          <font-awesome-icon :icon="['fas', 'pen']" />
          글쓰기
        </button>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination-section">
      <vue-awesome-paginate
          v-model="currentPage"
          :total-items="totalItems"
          :items-per-page="itemsPerPage"
          :max-pages-shown="5"
          :show-breakpoint-buttons="false"
      />
    </div>

    <!-- 하단 검색 섹션 -->
    <div class="bottom-section">
      <div class="search-section">
        <div class="search-form">
          <div class="search-input-group">
            <select class="search-option" v-model="schOpt">
              <option value="cntnt">전체 검색</option>
              <option value="titl">제목만 검색</option>
            </select>
            <div class="search-input-wrapper">
              <input
                  type="text"
                  class="search-input"
                  v-model="schKwd"
                  placeholder="검색어를 입력하세요..."
                  @keydown.enter="search"
              />
              <button @click="search" class="search-button">
                <!-- <font-awesome-icon :icon="['fas', 'search']" /> -->
                 검색
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { VueAwesomePaginate } from 'vue-awesome-paginate'
import { useRouter } from 'vue-router'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const router = useRouter()
const currentPage = ref(1)
const itemsPerPage = ref(Number(localStorage.getItem('itemsPerPage'))||20)
const items = ref([])
const totalItems = ref(0)
const schKwd = ref("");
const schOpt = ref("cntnt");

function goToDetail(id) {
  router.push(`/kc/${id}`)
}

function search(){
  fetchData();
}

const fetchData = async () => {
  try {
    const response = await axios.get('/psts', {
      params: {
        page: currentPage.value,
        pageSize: itemsPerPage.value,
        schKwd: schKwd.value,
        schOpt: schOpt.value
      },
    })
    items.value = response.data.list
    totalItems.value = response.data.total
  } catch (err) {
    console.error('데이터 로딩 실패:', err)
  }
}
watch(itemsPerPage, (newVal) => {
  localStorage.setItem('itemsPerPage', newVal)
})
watch([currentPage, itemsPerPage], fetchData)
onMounted(fetchData)

// Runtime mobile detection (replace media queries)
const isMobile = ref(false)
function updateIsMobile(){ isMobile.value = window.innerWidth <= 768 }
onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})
onUnmounted(() => window.removeEventListener('resize', updateIsMobile))

const formatDate = (utcString) => {
  const utcDate = new Date(utcString)
  const kstOffsetMs = 9 * 60 * 60 * 1000
  const kstDate = new Date(utcDate.getTime() + kstOffsetMs)
  const now = new Date()

  const diffMs = now - kstDate
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDay < 1) {
    const hh = String(kstDate.getHours()).padStart(2, '0')
    const mm = String(kstDate.getMinutes()).padStart(2, '0')
    return `${hh}:${mm}`
  } else if (diffDay < 7) {
    return `${diffDay}일 전`
  } else {
    const yyyy = kstDate.getFullYear()
    const mm = String(kstDate.getMonth() + 1).padStart(2, '0')
    const dd = String(kstDate.getDate()).padStart(2, '0')
    return `${yyyy}.${mm}.${dd}`
  }
}

function createPst() {
  router.push("/kc/new");
}
</script>

<style scoped>
@import '../css/main.css';
@import '../css/common.css';
</style>
