const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // 운영환경에서 콘솔 로그 제거
            config.optimization.minimizer.push(
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: true,
                            drop_debugger: true,
                        },
                    },
                })
            );
        }
    },
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
    }
}
