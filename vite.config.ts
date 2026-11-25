import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

/** Unique id of this build: the app compares it with /version.json to know a newer version is online. */
const BUILD_ID = new Date().toISOString();

export default defineConfig({
  // local development: /api is served by `npm run dev:api` (on Netlify it is the function)
  server: { proxy: { '/api': 'http://localhost:8788' } },
  base: '/',
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  plugins: [
    react(),
    {
      name: 'version-file',
      apply: 'build',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ build: BUILD_ID }) });
      }
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'push-sw.js'],
      manifest: {
        name: 'GROUP22 · EMSI — Study Hub 4IIR',
        short_name: 'GROUP22',
        description: 'Cours pas à pas, exercices corrigés et QCM — 4IIR G22, EMSI Rabat',
        theme_color: '#008d36',
        background_color: '#f2f9f5',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
        ]
      },
      workbox: {
        importScripts: ['push-sw.js'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        // the page itself is never served from the precache: always the network first (cached copy only when offline),
        // so a new deploy is what every visitor gets on the next load
        globPatterns: ['**/*.{js,css,svg,png}'],
        globIgnores: ['**/version.json', '**/push-sw.js'],
        navigateFallback: null,
        runtimeCaching: [
          {
            // fonts: only the files the browser really uses (one alphabet / weight) are kept, on first use
            urlPattern: ({ request }) => request.destination === 'font',
            handler: 'CacheFirst',
            options: { cacheName: 'g22-fonts', expiration: { maxEntries: 30, maxAgeSeconds: 365 * 86400 } }
          },
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: { cacheName: 'g22-pages', networkTimeoutSeconds: 4, expiration: { maxEntries: 5 } }
          }
        ],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion']
        }
      }
    }
  }
});
