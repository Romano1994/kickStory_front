<template>
  <div v-if="showPrompt" class="pwa-prompt-overlay">
    <div class="pwa-prompt">
      <div class="pwa-prompt-header">
        <div class="pwa-icon">
          <img src="@/assets/lookup_logo.png" alt="로고" />
        </div>
        <h3>앱으로 설치하기</h3>
        <button class="close-btn" @click="closePrompt">×</button>
      </div>
               <div class="pwa-prompt-footer">
                 <div class="footer-top">
                   <div class="location-permission-info">
                     <small>💡 앱 설치 후 현재 위치 기능을 사용하려면 브라우저 설정에서 위치 권한을 허용해주세요.</small>
                   </div>
                   <label class="dont-show-checkbox">
                     <input type="checkbox" v-model="dontShowAgain" />
                     <span>다시 보지 않음</span>
                   </label>
                 </div>
        <div class="footer-bottom">
          <button class="cancel-btn" @click="closePrompt">닫기</button>
          <button class="install-btn" @click="installApp" :disabled="!canInstall">
            설치하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/css/pwa-install-prompt.css'

export default {
  name: 'PwaInstallPrompt',
  data() {
    return {
      showPrompt: false,
      dontShowAgain: false,
      deferredPrompt: null,
      canInstall: false,
      hasShownInSession: false
    }
  },
  mounted() {
    // 모바일 화면에서만 동작
    if (this.isMobile()) {
      this.checkIfShouldShow();
      this.setupInstallPrompt();
    }
    
    // 라우트 변경 감지
    this.$watch('$route', () => {
      if (this.isMobile() && !this.hasShownInSession) {
        this.checkIfShouldShow();
      }
    });
  },
  methods: {
    isMobile() {
      return window.innerWidth <= 768;
    },
    checkIfShouldShow() {
      // 로컬스토리지에서 '다시 보지 않음' 확인
      if (localStorage.getItem('pwaPromptDontShow')) {
        return;
      }
      
      // PWA가 이미 설치되어 있는지 확인
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return;
      }
      
      // 현재 경로에서 이미 표시했는지 확인
      const currentPath = this.$route.path;
      const shownPaths = JSON.parse(sessionStorage.getItem('pwaPromptShownPaths') || '[]');
      
      if (shownPaths.includes(currentPath)) {
        return;
      }
      
      // 약간의 지연 후 표시 (페이지 로딩 완료 후)
      setTimeout(() => {
        this.showPrompt = true;
      }, 2000);
    },
    setupInstallPrompt() {
      // beforeinstallprompt 이벤트 리스너
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredPrompt = e;
        this.canInstall = true;
      });
      
      // appinstalled 이벤트 리스너
      window.addEventListener('appinstalled', () => {
        this.showPrompt = false;
        this.canInstall = false;
        this.deferredPrompt = null;
      });
    },
    async installApp() {
      if (!this.deferredPrompt) {
        // 수동 설치 안내
        this.showManualInstallGuide();
        return;
      }
      
      try {
        // 설치 프롬프트 표시
        this.deferredPrompt.prompt();
        
        // 사용자 선택 결과 확인
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('PWA 설치됨');
        } else {
          console.log('PWA 설치 취소됨');
        }
        
        this.deferredPrompt = null;
        this.canInstall = false;
        this.closePrompt();
      } catch (error) {
        console.error('PWA 설치 중 오류:', error);
        this.showManualInstallGuide();
      }
    },
    showManualInstallGuide() {
      // 수동 설치 안내 모달 표시
      this.$emit('show-install-guide');
      this.closePrompt();
    },
    closePrompt() {
      this.showPrompt = false;
      
      // 현재 경로에 표시했음을 기록
      const currentPath = this.$route.path;
      const shownPaths = JSON.parse(sessionStorage.getItem('pwaPromptShownPaths') || '[]');
      
      if (!shownPaths.includes(currentPath)) {
        shownPaths.push(currentPath);
        sessionStorage.setItem('pwaPromptShownPaths', JSON.stringify(shownPaths));
      }
      
      // '다시 보지 않음'이 체크되어 있으면 로컬스토리지에 저장
      if (this.dontShowAgain) {
        localStorage.setItem('pwaPromptDontShow', 'true');
      }
    }
  }
}
</script>