import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'node:url';

// CAP_BUILD=1: the web app packaged inside the Android app (base '/', no service worker).
const CAP = process.env.CAP_BUILD === '1';

export default defineConfig({
  define: { __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '0.1.0') },
  base: CAP ? '/' : '/matematix/',
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      disable: CAP,
      registerType: 'autoUpdate',
      manifest: {
        name: 'Matematix',
        short_name: 'Matematix',
        description: 'Mates y ciencias paso a paso, sin prisas y sin cuentas',
        start_url: '/matematix/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#5B4BC4',
        background_color: '#FBF8FF',
        lang: 'es',
        categories: ['education', 'kids'],
        icons: [{ src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        // Natural-voice clips: fetched the first time they are heard, then kept for offline use.
        runtimeCaching: [
          { urlPattern: ({ url }) => url.pathname.includes('/audio/') && url.pathname.endsWith('.json'), handler: 'StaleWhileRevalidate', options: { cacheName: 'mx-audio-index' } },
          { urlPattern: ({ url }) => url.pathname.includes('/audio/') && url.pathname.endsWith('.mp3'), handler: 'CacheFirst', options: { cacheName: 'mx-audio', expiration: { maxEntries: 4000 }, rangeRequests: true } },
        ],
      },
    }),
  ],
  test: { include: ['tests/unit/**/*.test.ts'], testTimeout: 120000 },
} as never);
