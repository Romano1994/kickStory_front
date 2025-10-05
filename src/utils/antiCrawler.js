// 크롤링 방지 유틸리티
export const antiCrawler = {
  // 허용된 User-Agent 체크
  isAllowedUA() {
    const userAgent = navigator.userAgent.toLowerCase();
    const allowedPatterns = [
      'googlebot', 'bingbot', 'yeti', 'kakaobot'
    ];
    
    return allowedPatterns.some(pattern => userAgent.includes(pattern));
  },

  // 의심스러운 User-Agent 감지
  detectSuspiciousUA() {
    // 허용된 User-Agent는 제외
    if (this.isAllowedUA()) {
      return false;
    }
    
    const userAgent = navigator.userAgent.toLowerCase();
    const suspiciousPatterns = [
      // SEO 도구
      'ahrefsbot', 'mj12bot', 'semrushbot', 'dotbot', 'screamingfrog',
      'siteauditbot', 'seokicks',
      
      // 해외 검색엔진
      'yandexbot', 'baiduspider', 'duckduckbot', 'applebot', 'msnbot', 'slurp',
      
      // 소셜 미디어
      'facebookexternalhit', 'twitterbot', 'linkedinbot', 'whatsapp', 'telegrambot',
      'skypeuripreview', 'discordbot', 'slackbot',
      
      // 자동화 도구
      'curl', 'wget', 'python', 'java', 'go-http-client', 'php', 'node',
      'scrapy', 'requests', 'urllib', 'httpx', 'aiohttp',
      'headlesschrome', 'phantomjs', 'selenium',
      
      // 일반적인 봇 패턴
      'bot', 'crawler', 'spider', 'scraper'
    ];
    
    return suspiciousPatterns.some(pattern => userAgent.includes(pattern));
  },

  // 자동화 도구 감지
  detectAutomation() {
    // WebDriver 감지
    if (window.webdriver || window.domAutomation || window.domAutomationController) {
      return true;
    }
    
    // PhantomJS 감지
    if (window.callPhantom || window._phantom) {
      return true;
    }
    
    // Selenium 감지
    if (window.__selenium_unwrapped || window.__webdriver_evaluate) {
      return true;
    }
    
    // Chrome DevTools 감지
    if (window.devtools && window.devtools.chrome) {
      return true;
    }
    
    return false;
  },

  // 헤드리스 브라우저 감지
  detectHeadless() {
    // Chrome headless 감지
    if (navigator.webdriver) {
      return true;
    }
    
    // 플러그인 체크 (헤드리스 브라우저는 플러그인이 적음)
    if (navigator.plugins.length === 0) {
      return true;
    }
    
    // 화면 해상도 체크
    if (screen.width === 0 || screen.height === 0) {
      return true;
    }
    
    // WebGL 감지
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (!gl) {
      return true;
    }
    
    return false;
  },

  // 속도 기반 감지 (너무 빠른 요청)
  detectSpeedCrawling() {
    const now = Date.now();
    const lastRequest = localStorage.getItem('lastRequest');
    
    // 모바일 환경에서는 더 관대하게 처리
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const threshold = isMobile ? 500 : 1000; // 모바일은 0.5초, 데스크톱은 1초
    
    if (lastRequest) {
      const timeDiff = now - parseInt(lastRequest);
      if (timeDiff < threshold) {
        return true;
      }
    }
    
    localStorage.setItem('lastRequest', now.toString());
    return false;
  },

  // 의심스러운 행동 감지
  detectSuspiciousBehavior() {
    // 모바일 환경에서는 터치 이벤트도 고려
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let interactionDetected = false;
    
    if (isMobile) {
      // 모바일에서는 터치 이벤트 감지
      document.addEventListener('touchstart', () => {
        interactionDetected = true;
      });
      document.addEventListener('touchend', () => {
        interactionDetected = true;
      });
    } else {
      // 데스크톱에서는 마우스 움직임 감지
      document.addEventListener('mousemove', () => {
        interactionDetected = true;
      });
    }
    
    // 3초 후에도 상호작용이 없으면 의심
    setTimeout(() => {
      if (!interactionDetected) {
        return true;
      }
    }, 3000);
    
    return false;
  },

  // 크롤러 차단 실행
  blockCrawler() {
    // 경고 메시지 표시
    const warningDiv = document.createElement('div');
    warningDiv.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                  background: rgba(0,0,0,0.9); color: white; z-index: 999999; 
                  display: flex; align-items: center; justify-content: center; 
                  font-family: Arial, sans-serif; font-size: 18px; text-align: center;">
        <div>
          <h2>🚫 접근이 차단되었습니다</h2>
          <p>자동화된 도구나 크롤러의 사용이 감지되었습니다.</p>
          <p>정상적인 브라우저를 사용해주세요.</p>
        </div>
      </div>
    `;
    document.body.appendChild(warningDiv);
    
    // 콘솔 메시지
    console.clear();
    console.log('%c🚫 크롤링이 감지되었습니다!', 'color: red; font-size: 20px; font-weight: bold;');
    console.log('%c이 사이트는 자동화된 도구의 사용을 금지합니다.', 'color: red; font-size: 14px;');
    
    // 페이지 리다이렉트 (선택사항)
    // window.location.href = 'https://lookup.kickstory.com/blocked';
  },

  // 메인 감지 함수
  checkAndBlock() {
    const isSuspicious = 
      this.detectSuspiciousUA() ||
      this.detectAutomation() ||
      this.detectHeadless() ||
      this.detectSpeedCrawling();
    
    if (isSuspicious) {
      this.blockCrawler();
      return true;
    }
    
    return false;
  },

  // 지연 실행으로 감지 회피 방지
  delayedCheck() {
    // 랜덤 지연 (1-3초)
    const delay = Math.random() * 2000 + 1000;
    
    setTimeout(() => {
      this.checkAndBlock();
    }, delay);
  }
};

// 페이지 로드 시 자동 실행
if (typeof window !== 'undefined') {
  // DOM 로드 완료 후 실행
  document.addEventListener('DOMContentLoaded', () => {
    antiCrawler.delayedCheck();
  });
  
  // 추가 보안: 5초마다 재검사
  setInterval(() => {
    antiCrawler.checkAndBlock();
  }, 5000);
}
