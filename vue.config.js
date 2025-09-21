module.exports = {
    pwa: {
        name: 'LookUP',
        themeColor: '#000000',
        msTileColor: '#000000',
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
