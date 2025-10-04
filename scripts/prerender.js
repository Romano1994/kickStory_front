// Prerendering 스크립트
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const routes = [
    { path: '/', file: 'index.html' },
    { path: '/map', file: 'map/index.html' },
    { path: '/community', file: 'community/index.html' },
    { path: '/community/write', file: 'community/write/index.html' }
];

const distDir = path.join(__dirname, '../dist');

async function prerender() {
    console.log('🚀 Prerendering 시작...');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    for (const route of routes) {
        try {
            console.log(`📄 ${route.path} prerendering 중...`);
            
            const page = await browser.newPage();
            
            // 뷰포트 설정
            await page.setViewport({
                width: 1920,
                height: 1080,
                deviceScaleFactor: 1
            });

            // 페이지 로드
            const url = `http://localhost:3000${route.path}`;
            await page.goto(url, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            // 추가 대기 시간 (동적 콘텐츠 로딩)
            await page.waitForTimeout(3000);

            // HTML 가져오기
            const html = await page.content();

            // 파일 저장
            const outputPath = path.join(distDir, route.file);
            const outputDir = path.dirname(outputPath);
            
            // 디렉토리 생성
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // HTML 최적화
            const optimizedHtml = optimizeHtml(html, route.path);
            
            fs.writeFileSync(outputPath, optimizedHtml);
            console.log(`✅ ${route.path} prerendered → ${route.file}`);
            
            await page.close();
        } catch (error) {
            console.error(`❌ ${route.path} prerendering 실패:`, error.message);
        }
    }

    await browser.close();
    console.log('🎉 Prerendering 완료!');
}

function optimizeHtml(html, route) {
    // 기본 최적화
    let optimized = html;
    
    // 페이지별 메타 태그 최적화
    const pageTitles = {
        '/': 'LookUP | Shopping Map',
        '/kc': 'LookUP | Community',
        '/kc/new': 'LookUP | Community',
        '/kc/:id/edit': 'LookUP | Community',
        '/kc/:id': 'LookUP | Community'
    };
    
    const pageDescriptions = {
        '/': '국내 패션 매장, 편집샵, 브랜드 매장, 팝업 매장들의 위치 정보를 공유하고 최적화된 경로로 여러 매장을 방문할 수 있는 스마트한 매장 검색 서비스입니다.',
        '/kc': '패션과 스타일에 대한 정보를 공유하고 소통하는 커뮤니티입니다. 매장 리뷰, 패션 정보, 쇼핑 팁을 나누어보세요.',
        '/kc/new': '패션과 스타일에 대한 정보를 공유해보세요. 매장 리뷰, 패션 정보, 쇼핑 경험을 다른 사용자들과 나눌 수 있습니다.',
        '/kc/:id/edit': '패션과 스타일에 대한 정보를 수정해보세요. 매장 리뷰, 패션 정보, 쇼핑 경험을 다른 사용자들과 나눌 수 있습니다.',
        '/kc/:id': '패션과 스타일에 대한 상세 정보를 확인하고 댓글로 소통해보세요.'
    };
    
    // 타이틀 업데이트
    if (pageTitles[route]) {
        optimized = optimized.replace(
            /<title>.*?<\/title>/i,
            `<title>${pageTitles[route]}</title>`
        );
    }
    
    // 메타 설명 업데이트
    if (pageDescriptions[route]) {
        optimized = optimized.replace(
            /<meta name="description" content=".*?"/i,
            `<meta name="description" content="${pageDescriptions[route]}"`
        );
    }
    
    // JSON-LD 구조화된 데이터 추가
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "LookUP",
        "url": "https://lookup.kickstory.com",
        "description": pageDescriptions[route] || pageDescriptions['/']
    };
    
    const jsonLdScript = `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`;
    optimized = optimized.replace('</head>', `${jsonLdScript}\n</head>`);
    
    return optimized;
}

// 실행
if (require.main === module) {
    prerender().catch(console.error);
}

module.exports = { prerender, optimizeHtml };
