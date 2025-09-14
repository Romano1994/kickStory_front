<template>
  <div class="community-container">
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
                <font-awesome-icon :icon="['fas', 'search']" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
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

.community-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 0.5rem;
  background: linear-gradient(135deg, var(--color2) 0%, rgba(255, 255, 255, 0.02) 100%);
  min-height: calc(100vh - 4rem);
}

/* 헤더 섹션 */
.community-header {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  flex: 1;
}

.page-title {
  margin: 0 0 0.25rem 0;
  color: var(--color1);
  font-family: var(--sub-font);
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.title-icon {
  color: var(--color6);
  font-size: 1.5rem;
}

.page-subtitle {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--main-font);
  font-size: 1.1rem;
  font-weight: 400;
}

.write-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--color6) 0%, #2a7a7f 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-family: var(--sub-font);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.write-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.write-button:hover::before {
  left: 100%;
}

.write-button:hover {
  background: linear-gradient(135deg, #2a7a7f 0%, var(--color6) 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

/* 게시글 섹션 */
.posts-section {
  margin-bottom: 1.5rem;
}

.posts-table {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
}

/* 테이블 헤더 */
.table-header {
  display: grid;
  grid-template-columns: 3fr 1.5fr 0.7fr 0.8fr; /* 제목, 작성자 넓게 / 조회수, 날짜 좁게 */
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.header-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color1);
  font-family: var(--sub-font);
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-icon {
  color: var(--color6);
  font-size: 1rem;
}

.title-header {
  justify-content: flex-start;
}

.author-header,
.views-header,
.date-header {
  justify-content: center;
}

.settings-header {
  justify-content: flex-end;
}

/* 테이블 바디 */
.table-body {
  min-height: 400px;
}

.table-row {
  display: grid;
  grid-template-columns: 3fr 1.5fr 0.7fr 0.8fr; /* 헤더와 동일한 비율 */
  gap: 1rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
}

.table-row::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, var(--color6), #2a7a7f);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.table-row:hover::before {
  transform: scaleY(1);
}

.table-row:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
  transform: translateX(8px);
}

.table-row:last-child {
  border-bottom: none;
}

/* 테이블 셀 */
.table-cell {
  display: flex;
  align-items: center;
  color: var(--color1);
  font-family: var(--main-font);
  font-size: 0.95rem;
}

.title-cell {
  justify-content: flex-start;
}

.author-cell,
.views-cell,
.date-cell {
  justify-content: center;
}

/* 제목 셀 */
.title-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.title-text {
  flex: 1;
  font-weight: 500;
  line-height: 1.4;
  transition: color 0.2s ease;
}

.table-row:hover .title-text {
  color: var(--color6);
}

.comment-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(255, 160, 0, 0.2);
  color: var(--color6);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

/* 작성자, 조회수, 날짜 셀 */
.author-content,
.views-content,
.date-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.cell-icon {
  color: var(--color6);
  font-size: 0.85rem;
  opacity: 0.7;
}

/* 빈 상태 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 1.5rem;
}

.empty-title {
  margin: 0 0 0.5rem 0;
  color: var(--color1);
  font-family: var(--sub-font);
  font-size: 1.5rem;
  font-weight: 600;
}

.empty-text {
  margin: 0 0 2rem 0;
  color: rgba(255, 255, 255, 0.7);
  font-family: var(--main-font);
  font-size: 1rem;
}

.empty-action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--color6), #2a7a7f);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-family: var(--sub-font);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.empty-action-button:hover {
  background: linear-gradient(135deg, #2a7a7f, var(--color6));
  transform: translateY(-1px);
}

/* 페이지네이션 */
.pagination-section {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.pagination-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.paginate-buttons {
  width: 52px;
  height: 52px;
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--color1);
  font-size: 1rem;
  font-family: var(--sub-font);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
}

.paginate-buttons::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.paginate-buttons::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.4s ease;
}

.paginate-buttons:hover::before {
  opacity: 1;
}

.paginate-buttons:hover::after {
  width: 100%;
  height: 100%;
}

.paginate-buttons:hover {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.08) 100%);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
}

.paginate-buttons:active {
  transform: translateY(-1px) scale(1.02);
  transition: all 0.1s ease;
}

.active-page {
  background: linear-gradient(145deg, var(--color6) 0%, #2a7a7f 100%);
  border-color: var(--color6);
  color: white;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  position: relative;
}

.active-page::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(145deg, var(--color6), #2a7a7f);
  border-radius: 20px;
  z-index: -1;
  opacity: 0.3;
  filter: blur(8px);
}

.active-page:hover {
  background: linear-gradient(145deg, #2a7a7f 0%, var(--color6) 100%);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
}

.active-page:hover::before {
  opacity: 0.5;
}

/* 이전/다음 버튼 특별 스타일 */
.paginate-buttons[aria-label*="Previous"],
.paginate-buttons[aria-label*="Next"] {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.06) 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  font-size: 1.1rem;
  width: 56px;
  height: 56px;
}

.paginate-buttons[aria-label*="Previous"]:hover,
.paginate-buttons[aria-label*="Next"]:hover {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.12) 100%);
  border-color: var(--color6);
  transform: translateY(-3px) scale(1.08);
}

/* 페이지 점프 버튼 (첫 페이지/마지막 페이지) */
.paginate-buttons[aria-label*="First"],
.paginate-buttons[aria-label*="Last"] {
  background: linear-gradient(145deg, rgba(255, 160, 0, 0.15) 0%, rgba(255, 160, 0, 0.06) 100%);
  border: 1px solid rgba(255, 160, 0, 0.25);
  color: var(--color6);
}

.paginate-buttons[aria-label*="First"]:hover,
.paginate-buttons[aria-label*="Last"]:hover {
  background: linear-gradient(145deg, rgba(255, 160, 0, 0.25) 0%, rgba(255, 160, 0, 0.12) 100%);
  border-color: var(--color6);
}

/* 반응형 디자인 */
@media screen and (max-width: 768px) {
  .pagination-section {
    margin: 1.5rem 0;
  }
  
  .paginate-buttons {
    width: 48px;
    height: 48px;
    font-size: 0.9rem;
  }
  
  .paginate-buttons[aria-label*="Previous"],
  .paginate-buttons[aria-label*="Next"] {
    width: 52px;
    height: 52px;
  }
  
  .pagination-container {
    gap: 0.4rem;
  }
}

@media screen and (max-width: 480px) {
  .paginate-buttons {
    width: 44px;
    height: 44px;
    font-size: 0.85rem;
  }
  
  .paginate-buttons[aria-label*="Previous"],
  .paginate-buttons[aria-label*="Next"] {
    width: 48px;
    height: 48px;
  }
  
  .pagination-container {
    gap: 0.3rem;
  }
}

/* 하단 섹션 */
.bottom-section {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.search-section {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  max-width: 600px;
  width: 100%;
}

.search-header,
.settings-header {
  margin-bottom: 1rem;
}

.search-title,
.settings-title {
  margin: 0;
  color: var(--color1);
  font-family: var(--sub-font);
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-title svg,
.settings-title svg {
  color: var(--color6);
}

.search-form {
  width: 100%;
}

.search-input-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-option {
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color1);
  font-size: 0.9rem;
  font-family: var(--main-font);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 140px;
}

.search-option:focus {
  outline: none;
  border-color: var(--color6);
  box-shadow: 0 0 0 2px rgba(255, 160, 0, 0.2);
}

.search-input-wrapper {
  position: relative;
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color1);
  font-size: 0.9rem;
  font-family: var(--main-font);
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color6);
  box-shadow: 0 0 0 2px rgba(255, 160, 0, 0.2);
  background: rgba(255, 255, 255, 0.15);
}

.search-input::placeholder {
  color: rgba(255, 244, 204, 0.6);
}

.search-button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: var(--color6);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-button:hover {
  background: #2a7a7f;
  transform: translateY(-50%) scale(1.05);
}

.page-size-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.page-size-label {
  color: var(--color1);
  font-family: var(--main-font);
  font-size: 0.9rem;
  font-weight: 500;
}

.page-size-select {
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color1);
  font-size: 0.9rem;
  font-family: var(--main-font);
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Dropdown list appearance */
.page-size-select option {
  background: #000; /* black background for dropdown items */
  color: #fff;      /* white text for readability */
}
.page-size-select optgroup {
  background: #000;
  color: #fff;
}

/* For Safari rendering consistency */
@supports (-webkit-touch-callout: none) {
  .page-size-select option { background-color: #000; color: #fff; }
}

.page-size-select:focus {
  outline: none;
  border-color: var(--color6);
  box-shadow: 0 0 0 2px rgba(255, 160, 0, 0.2);
}

/* 반응형 디자인 */
@media screen and (max-width: 1200px) {
  .posts-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
}

@media screen and (max-width: 1024px) {
  .community-container {
    padding: 0.75rem 0.5rem;
  }
  
  .search-input-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-option {
    min-width: auto;
  }
}

@media screen and (max-width: 768px) {
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 0.75rem;
  }
  
  .header-cell,
  .table-cell {
    justify-content: flex-start;
    padding: 0.5rem 0;
  }
  
  .title-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .author-content,
  .views-content,
  .date-content {
    justify-content: flex-start;
  }
  
  .settings-header {
    justify-content: flex-start;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .write-button {
    justify-content: center;
  }
}

@media screen and (max-width: 480px) {
  .community-container {
    padding: 0.5rem 0.25rem;
  }
  
  .community-header {
    padding: 1rem;
  }
  
  .table-header,
  .table-row {
    padding: 0.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .title-icon {
    font-size: 1.25rem;
  }
}
</style>
