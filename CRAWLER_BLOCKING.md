# LookUP 크롤링 방지 설정 가이드

## 🛡️ 구현된 크롤링 방지 기능

### 1. robots.txt 강화
- **기본 정책**: 모든 크롤러 차단
- **선택적 허용**: Google, Bing, 네이버만 허용
- **악성 크롤러 차단**: AhrefsBot, SemrushBot, MJ12bot 등

### 2. .htaccess 서버 설정
- **User-Agent 차단**: 의심스러운 크롤러 자동 차단
- **API 경로 보호**: /api/, /admin/, /user/ 등 민감한 경로 보호
- **Rate Limiting**: 과도한 요청 제한
- **보안 헤더**: X-Robots-Tag, X-Frame-Options 등

### 3. JavaScript 클라이언트 보호
- **자동화 도구 감지**: Selenium, PhantomJS, Puppeteer 등
- **헤드리스 브라우저 감지**: WebDriver, 플러그인 체크 등
- **속도 기반 감지**: 너무 빠른 연속 요청 차단
- **실시간 모니터링**: 5초마다 재검사

### 4. HTML 메타 태그
- **검색엔진 차단**: noindex, nofollow, nosnippet, noarchive
- **소셜 미디어 차단**: Facebook, Twitter, LinkedIn 등
- **모든 봇 차단**: Google, Bing, Yandex, Baidu 등

## 📋 차단된 크롤러 목록

### SEO 도구
- AhrefsBot
- SemrushBot
- MJ12bot
- DotBot

### 검색엔진
- YandexBot (러시아)
- Baiduspider (중국)
- DuckDuckBot

### 소셜 미디어
- facebookexternalhit
- Twitterbot
- LinkedInBot
- WhatsApp
- TelegramBot

### 자동화 도구
- Scrapy
- curl
- wget
- python-requests
- Java HTTP 클라이언트
- Go HTTP 클라이언트

## 🔧 설정 커스터마이징

### 허용할 검색엔진 추가
`public/robots.txt`에서 다음 형식으로 추가:
```
User-agent: [봇이름]
Allow: /$
Allow: /map$
Allow: /community$
Disallow: /api/
Disallow: /admin/
Disallow: /user/
Disallow: /data/
Crawl-delay: 3
```

### IP 기반 접근 제어
`public/.htaccess`에서 허용할 IP 추가:
```
Allow from 192.168.1.0/24
Allow from 10.0.0.0/8
```

### JavaScript 감지 설정 조정
`src/utils/antiCrawler.js`에서 감지 조건 수정:
```javascript
// 새로운 의심 패턴 추가
const suspiciousPatterns = [
    'curl', 'wget', 'python', 'java', 'go-http-client',
    'scrapy', 'requests', 'urllib', 'httpx', 'aiohttp',
    'headlesschrome', 'phantomjs', 'selenium',
    'bot', 'crawler', 'spider', 'scraper',
    'your-new-pattern'  // 여기에 추가
];
```

## 🚨 주의사항

### 1. SEO 영향
- **검색엔진 노출**: 대부분의 크롤러가 차단되어 검색 노출이 제한됨
- **소셜 공유**: Facebook, Twitter 등에서 링크 미리보기 불가
- **해결방안**: 필요한 페이지만 선택적으로 허용

### 2. 정상 사용자 영향
- **자동화된 브라우저**: 일부 자동화 도구 사용 시 차단될 수 있음
- **개발 도구**: 개발 중 크롤링 방지 기능으로 인한 문제 가능
- **해결방안**: 개발 환경에서는 비활성화 권장

### 3. 성능 영향
- **JavaScript 실행**: 클라이언트 사이드 감지로 약간의 성능 영향
- **서버 부하**: Rate limiting으로 정상 사용자도 영향받을 수 있음

## 🔄 설정 변경 방법

### 크롤링 방지 비활성화
1. `src/main.js`에서 `import './utils/antiCrawler'` 주석 처리
2. `vue.config.js`에서 크롤링 방지 플러그인 주석 처리
3. `public/robots.txt`에서 `Allow: /` 설정으로 변경

### 선택적 허용
1. `public/robots.txt`에서 필요한 봇만 허용
2. `src/utils/antiCrawler.js`에서 감지 조건 완화
3. `public/.htaccess`에서 Rate limiting 조정

## 📊 모니터링

### 크롤링 시도 확인
- 서버 로그에서 차단된 요청 확인
- Google Search Console에서 크롤링 오류 모니터링
- 웹 분석 도구에서 비정상적인 트래픽 패턴 확인

### 정상 사용자 영향 모니터링
- 사용자 피드백 수집
- 웹 분석에서 이탈률 확인
- 에러 로그 모니터링

## 🆘 문제 해결

### 정상 사용자가 차단되는 경우
1. User-Agent 확인
2. `antiCrawler.js`에서 예외 처리 추가
3. IP 화이트리스트 설정

### 크롤링이 여전히 발생하는 경우
1. 새로운 크롤러 패턴 확인
2. `.htaccess`에 추가 규칙 적용
3. 서버 레벨에서 추가 보안 설정

---

**⚠️ 중요**: 이 설정은 강력한 크롤링 방지 기능입니다. 사용하기 전에 비즈니스 요구사항과 SEO 전략을 충분히 검토하세요.
