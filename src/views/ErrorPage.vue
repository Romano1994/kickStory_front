<template>
  <div class="error-wrapper" :class="{ 'is-mobile': isMobile }">
    <div class="error-container">
      <div class="error-card">
        <div class="error-header">
          <h1 class="page-title">
            <font-awesome-icon :icon="['fas', 'exclamation-triangle']" class="title-icon" />
            404 Error
          </h1>
          <p class="page-subtitle">페이지를 찾을 수 없습니다</p>
        </div>

        <div class="error-content">
          <div class="error-number">404</div>
          <div class="error-message">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.<br>
            URL을 다시 확인해주시거나 아래 버튼을 이용해 이동해주세요.
          </div>
          
          <div class="error-icon">
            <font-awesome-icon :icon="['fas', 'shoe-prints']" class="sneaker-icon" />
          </div>
        </div>

        <div class="error-actions">
          <button @click="goHome" class="action-button primary">
            <font-awesome-icon :icon="['fas', 'home']" />
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';

const router = useRouter();
const isMobile = ref(false);

const goHome = () => {
  router.push('/');
};

// Mobile detection
function updateIsMobile() { 
  isMobile.value = window.innerWidth <= 768; 
}

onMounted(() => { 
  updateIsMobile(); 
  window.addEventListener('resize', updateIsMobile); 
});

onUnmounted(() => window.removeEventListener('resize', updateIsMobile));
</script>

<style scoped>
@import '../css/main.css';

.error-wrapper {
  display: flex;
  height: calc(100vh - 4rem);
  width: 100%;
  background-color: var(--color3);
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.error-container {
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-card {
  background-color: rgb(204, 195, 163);
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.error-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  pointer-events: none;
}

.error-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.page-title {
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: var(--color1);
  font-family: var(--sub-font);
  font-size: 2rem;
  font-weight: 700;
}

.title-icon {
  color: var(--color6);
  font-size: 1.5rem;
}

.page-subtitle {
  margin: 0;
  color: rgba(0, 0, 0, 0.7);
  font-family: var(--main-font);
  font-size: 1.1rem;
  font-weight: 400;
}

.error-content {
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.error-number {
  font-size: 6rem;
  font-weight: bold;
  color: var(--color6);
  line-height: 1;
  margin-bottom: 1rem;
  font-family: var(--sub-font);
  text-shadow: 0 0 20px rgba(54, 150, 156, 0.3);
}

.error-message {
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 1.5rem;
  line-height: 1.6;
  font-family: var(--main-font);
}

.error-icon {
  margin: 1rem 0;
}

.sneaker-icon {
  font-size: 3rem;
  color: var(--color6);
  animation: bounce 2s infinite;
  opacity: 0.8;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 8px 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: var(--sub-font);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button.primary {
  background-color: var(--color6);
  color: white;
}

.action-button.primary:hover {
  background-color: #2a7a7f;
}

/* 모바일 반응형 */
@media screen and (max-width: 768px) {
  .error-wrapper {
    height: 100vh;
    padding: 0.75rem;
  }
  
  .error-card {
    padding: 1.5rem;
    border-radius: 12px;
  }
  
  .page-title {
    font-size: 1.5rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .title-icon {
    font-size: 1.25rem;
  }
  
  .error-number {
    font-size: 4rem;
  }
  
  .error-message {
    font-size: 0.9rem;
  }
  
  .sneaker-icon {
    font-size: 2rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .action-button {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }
}

@media screen and (max-width: 480px) {
  .error-wrapper {
    padding: 0.5rem;
  }
  
  .error-card {
    padding: 1rem;
    border-radius: 10px;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .error-number {
    font-size: 3rem;
  }
  
  .error-message {
    font-size: 0.85rem;
  }
  
  .action-button {
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
  }
}

/* 매우 작은 화면 (360px 이하) */
@media screen and (max-width: 360px) {
  .error-card {
    padding: 0.75rem;
    border-radius: 8px;
  }
  
  .page-title {
    font-size: 1.1rem;
  }
  
  .error-number {
    font-size: 2.5rem;
  }
  
  .error-message {
    font-size: 0.8rem;
  }
  
  .action-button {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}
</style>