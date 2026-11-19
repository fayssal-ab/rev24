import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // local development: /api is served by `npm run dev:api` (on Netlify it is the function)
  server: { proxy: { '/api': 'http://localhost:8788' } },
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'GROUP22 · EMSI — Study Hub 4IIR',
        short_name: 'GROUP22',
        description: 'Cours pas à pas, exercices corrigés et QCM — 4IIR G22, EMSI Rabat',
        theme_color: '#008d36',
        background_color: '#f2f9f5',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
        ]
      },
      workbox: { cleanupOutdatedCaches: true, clientsClaim: true, skipWaiting: true, globPatterns: ['**/*.{js,css,html,svg,png,woff2,json}'], maximumFileSizeToCacheInBytes: 6 * 1024 * 1024 }
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
