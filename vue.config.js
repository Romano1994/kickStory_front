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
        themeColor: '#000000',
        msTileColor: '#000000',
        iconPaths: {
          favicon32: 'favicon.png',
          favicon16: 'favicon.png',
          appleTouchIcon: 'favicon.png',
          maskIcon: 'favicon.png',
          msTileImage: 'favicon.png'
        },
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
        manifestOptions: {
            name: 'LookUP',
            short_name: 'LookUP',
            start_url: '.',
            display: 'standalone',
            background_color: '#000000',
            theme_color: '#000000',
            "icons": [
                {
                    "src": "/icon-192.png",
                    "sizes": "192x192",
                    "type": "image/png"
                },
                {
                    "src": "/icon-512.png",
                    "sizes": "512x512",
                    "type": "image/png"
                },
                {
                    "src": "/favicon.ico",
                    "sizes": "16x16 32x32 48x48 64x64",
                    "type": "image/x-icon"
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
