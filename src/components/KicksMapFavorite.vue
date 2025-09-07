<template>
  <div class="favorite-content">
    <div v-if="favoriteCourses.length === 0" class="empty-placeholder">
      <p>저장된 즐겨찾기가 없습니다.</p>
    </div>
    <div v-else class="favorite-list">
      <div 
        v-for="(favorite, index) in favoriteCourses" 
        :key="index"
        class="favorite-item"
      >
        <div class="favorite-header">
          <h3 class="favorite-name">{{ favorite.favoriteCourseName }}</h3>
          <div class="favorite-actions">
            <button 
              class="delete-btn" 
              @click="deleteFavorite(index)"
              title="삭제"
            >
              🗑️
            </button>
          </div>
        </div>
        <div v-if="favorite.description" class="favorite-description">
          {{ favorite.description }}
        </div>
        <div class="favorite-info">
          <span class="store-count">스토어 {{ favorite.stores.length }}개</span>
          <span class="created-date">{{ formatDate(favorite.createdAt) }}</span>
        </div>
        <div class="store-preview">
          <div 
            v-for="(store, storeIndex) in favorite.stores.slice(0, 3)" 
            :key="storeIndex"
            class="store-preview-item"
          >
            <span class="store-order">{{ storeIndex + 1 }}</span>
            <span class="store-name">{{ store.storeKorNm }} {{ store.branchNm || '' }}</span>
          </div>
          <div v-if="favorite.stores.length > 3" class="more-stores">
            +{{ favorite.stores.length - 3 }}개 더
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'KicksMapFavorite',
  emits: ['load-favorite'],
  data() {
    return {
      favoriteCourses: []
    }
  },
  methods: {
    loadFavoritesFromStorage() {
      const stored = localStorage.getItem('favoriteCourse');
      this.favoriteCourses = stored ? JSON.parse(stored) : [];
    },
    loadFavorite(favorite) {
      this.$emit('load-favorite', favorite);
    },
    deleteFavorite(index) {
      if (confirm('이 즐겨찾기를 삭제하시겠습니까?')) {
        this.favoriteCourses.splice(index, 1);
        localStorage.setItem('favoriteCourse', JSON.stringify(this.favoriteCourses));
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  },
  mounted() {
    this.loadFavoritesFromStorage();
  }
}
</script>
<style scoped>
@import '../css/main.css';
@import '../css/map.css';

.favorite-content {
  padding: 1rem;
}

.empty-placeholder {
  text-align: center;
  padding: 2rem;
  color: var(--color1);
  font-family: var(--main-font);
}

.favorite-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.favorite-item {
  background-color: var(--color2);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.favorite-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
}

.favorite-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.favorite-name {
  margin: 0;
  color: var(--color1);
  font-family: var(--sub-font);
  font-size: 1.1rem;
  font-weight: bold;
}

.favorite-actions {
  display: flex;
  gap: 0.5rem;
}

.load-btn,
.delete-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.load-btn:hover {
  background-color: var(--color6);
}

.delete-btn:hover {
  background-color: rgba(184, 92, 59, 0.8);
}

.favorite-description {
  color: var(--color1);
  font-family: var(--main-font);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

.favorite-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  font-size: 0.85rem;
  color: var(--color1);
  opacity: 0.7;
}

.store-count {
  font-weight: 500;
}

.created-date {
  font-family: var(--main-font);
}

.store-preview {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.store-preview-item {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
}

.store-order {
  background-color: var(--color6);
  color: white;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.store-name {
  color: var(--color1);
  font-family: var(--main-font);
}

.more-stores {
  color: var(--color1);
  font-family: var(--main-font);
  font-size: 0.8rem;
  opacity: 0.6;
  margin-left: 1.6rem;
  font-style: italic;
}

@media screen and (max-width: 720px) {
  .favorite-content {
    padding: 0.5rem;
  }
  
  .favorite-item {
    padding: 0.8rem;
  }
  
  .favorite-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .favorite-actions {
    align-self: flex-end;
  }
}
</style> 