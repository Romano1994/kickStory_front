const TerserPlugin = require('terser-webpack-plugin');
const PrerenderSPAPlugin = require('prerender-spa-plugin');

module.exports = {
    pwa: {
        name: 'LookUP',
        themeColor: 'rgb(36, 32, 28)',
        msTileColor: 'rgb(36, 32, 28)',
        iconPaths: {
          favicon32: 'assets/icons/icon-32.png',
          favicon16: 'assets/icons/icon-16.png',
          appleTouchIcon: 'assets/icons/icon-180.png',
          maskIcon: 'assets/icons/icon-192.png',
          msTileImage: 'assets/icons/icon-192.png'
        },
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
        manifestOptions: {
            name: 'LookUP - 편집샵 & 브랜드 매장 찾기',
            short_name: 'LookUP',
            description: '국내 편집샵, 브랜드 매장, 팝업 매장들의 위치 정보를 공유하고 최적화된 경로로 여러 매장을 방문할 수 있는 스마트한 매장 검색 서비스입니다.',
            start_url: '.',
            display: 'standalone',
            background_color: 'rgb(36, 32, 28)',
            theme_color: 'rgb(36, 32, 28)',
            permissions: ['geolocation'],
            categories: ['business', 'navigation', 'shopping', 'lifestyle'],
            lang: 'ko',
            "icons": [
                {
                    "src": "/assets/icons/icon-192.png",
                    "sizes": "192x192",
                    "type": "image/png"
                },
                {
                    "src": "/assets/icons/icon-512.png",
                    "sizes": "512x512",
                    "type": "image/png"
                },
                {
                    "src": "/assets/icons/icon-180.png",
                    "sizes": "180x180",
                    "type": "image/png"
                },
                {
                    "src": "/assets/icons/icon-64.png",
                    "sizes": "64x64",
                    "type": "image/png"
                },
                {
                    "src": "/assets/icons/icon-48.png",
                    "sizes": "48x48",
                    "type": "image/png"
                },
                {
                    "src": "/assets/icons/icon-32.png",
                    "sizes": "32x32",
                    "type": "image/png"
                },
                {
                    "src": "/assets/icons/icon-16.png",
                    "sizes": "16x16",
                    "type": "image/png"
                }
            ]
        },
        // iconPaths: {
        //   favicon32: 'assets/logo_modified2.png',
        //   favicon16: 'assets/logo_modified2.png',
        //   appleTouchIcon: 'assets/logo_modified2.png',
        //   maskIcon: 'assets/logo_modified2.png',
        //   msTileImage: 'assets/logo_modified2.png'
        // },
        workboxOptions: {
            skipWaiting: true,
            clientsClaim: true
        }
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // 운영환경 최적화는 아래에서 처리
            
            // 성능 최적화 설정
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                    common: {
                        name: 'common',
                        minChunks: 2,
                        chunks: 'all',
                        enforce: true
                    }
                }
            };
            
            // 압축 설정 개선
            config.optimization.minimizer.push(
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: true,
                            drop_debugger: true,
                            pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
                        },
                        mangle: {
                            safari10: true
                        }
                    }
                })
            );
            
            // 크롤링 방지 헤더 추가
            config.plugins.push({
                apply: (compiler) => {
                    compiler.hooks.emit.tapAsync('CrawlerBlockingPlugin', (compilation, callback) => {
                        // HTML 파일에 크롤링 방지 메타 태그 추가
                        Object.keys(compilation.assets).forEach(filename => {
                            if (filename.endsWith('.html')) {
                                const asset = compilation.assets[filename];
                                let source = asset.source();
                                
                                // 크롤링 방지 메타 태그 추가
                                const antiCrawlerMeta = `
    <!-- 크롤링 방지 -->
    <meta name="robots" content="noindex, nofollow, nosnippet, noarchive">
    <meta name="googlebot" content="noindex, nofollow">
    <meta name="bingbot" content="noindex, nofollow">
    <meta name="slurp" content="noindex, nofollow">
    <meta name="duckduckbot" content="noindex, nofollow">
    <meta name="baiduspider" content="noindex, nofollow">
    <meta name="yandexbot" content="noindex, nofollow">
    <meta name="facebookexternalhit" content="noindex, nofollow">
    <meta name="twitterbot" content="noindex, nofollow">
    <meta name="linkedinbot" content="noindex, nofollow">
    <meta name="whatsapp" content="noindex, nofollow">
    <meta name="telegrambot" content="noindex, nofollow">
    <meta name="applebot" content="noindex, nofollow">
    <meta name="msnbot" content="noindex, nofollow">
    <meta name="slurp" content="noindex, nofollow">
`;
                                
                                source = source.replace('</head>', antiCrawlerMeta + '\n</head>');
                                compilation.assets[filename] = {
                                    source: () => source,
                                    size: () => source.length
                                };
                            }
                        });
                        
                        callback();
                    });
                }
            });
            
            // Prerendering 설정 (현재 비활성화 - 복잡한 설정 필요)
            // 향후 필요시 별도 스크립트로 구현 예정
        }
    }
}
