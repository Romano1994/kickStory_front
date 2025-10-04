const PrerenderSPAPlugin = require('prerender-spa-plugin');
const Renderer = require('prerender-spa-plugin/lib/renderers/HeadlessChromeRenderer');
const path = require('path');

module.exports = {
  // Prerendering 설정
  staticDir: path.join(__dirname, 'dist'),
  
  // prerender할 경로들
  routes: [
    '/',
    '/map',
    '/community',
    '/community/write'
  ],
  
  // 렌더러 설정
  renderer: new Renderer({
    // 헤드리스 크롬 옵션
    renderAfterTime: 3000, // 3초 후 렌더링
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ]
  }),
  
  // 포스트 프로세싱
  postProcess(renderedRoute) {
    // HTML 최적화
    renderedRoute.html = renderedRoute.html
      // 메타 태그 최적화
      .replace(/<title>.*?<\/title>/i, `<title>${getPageTitle(renderedRoute.route)}</title>`)
      // 불필요한 주석 제거
      .replace(/<!--[\s\S]*?-->/g, '')
      // 공백 정리
      .replace(/\s+/g, ' ')
      .trim();
    
    return renderedRoute;
  }
};

// 페이지별 타이틀 설정
function getPageTitle(route) {
  const titles = {
    '/': 'LookUP | Shopping Map',
    '/kc': 'LookUP | Community',
    '/kc/new': 'LookUP | Community',
    '/kc/:id/edit': 'LookUP | Community',
    '/kc/:id': 'LookUP | Community'
  };
  
  return titles[route] || 'LookUP | Shopping Map';
}
