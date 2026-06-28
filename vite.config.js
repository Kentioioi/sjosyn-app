import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // injectManifest = vi skriver egen SW (src/sw.js) som inkluderer både
      // workbox-precache OG push-event handler for bakgrunnsvarsling.
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      includeAssets: ['icon.png', 'icon-maskable.png'],
      manifest: {
        name: 'Sjøsyn',
        short_name: 'Sjøsyn',
        description: 'Live AIS-sporing for norske farvann',
        theme_color: '#0f1923',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          // 'any' = full motiv (iOS/desktop). 'maskable' = hvit bg + padding så
          // Android adaptive-mask aldri klipper motivet og alltid viser hvitt.
          { src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      // injectManifest-strategi tar pre-cache-filer fra denne config
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,ico,woff2}'],
      },
    }),
  ],

  server: {
    port: Number(process.env.PORT) || 5173,
    proxy: {
      // /bw-token  →  https://id.barentswatch.no/connect/token
      '/bw-token': {
        target: 'https://id.barentswatch.no',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bw-token/, '/connect/token'),
        secure: true,
      },
      // /bw-ais/…  →  https://live.ais.barentswatch.no/…
      '/bw-ais': {
        target: 'https://live.ais.barentswatch.no',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bw-ais/, ''),
        secure: true,
      },
      // /bw-historic/…  →  https://historic.ais.barentswatch.no/…
      '/bw-historic': {
        target: 'https://historic.ais.barentswatch.no',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bw-historic/, ''),
        secure: true,
      },
      // /met-ocean?lat=..&lon=..  →  MET Norway oceanforecast 2.0
      // Dev bypasses the Netlify function so the User-Agent MET TOS requires
      // must be injected here too.
      '/met-ocean': {
        target: 'https://api.met.no',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/met-ocean/, '/weatherapi/oceanforecast/2.0/complete'),
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('User-Agent', 'MarineWatch (kenneth222.kn@gmail.com)')
          })
        },
      },
      // /met-weather?lat=..&lon=..  →  MET Norway locationforecast 2.0 (vind/vær)
      '/met-weather': {
        target: 'https://api.met.no',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/met-weather/, '/weatherapi/locationforecast/2.0/complete'),
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('User-Agent', 'MarineWatch (kenneth222.kn@gmail.com)')
          })
        },
      },
    },
  },
})
