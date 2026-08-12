import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('src', import.meta.url)) },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,png,webp,svg,woff2}'],
        navigateFallback: '/offline.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            // Planet-provided assets served CacheFirst — never change at runtime
            urlPattern: /\/assets\//,
            handler: 'CacheFirst',
            options: { cacheName: 'planet-assets' },
          },
        ],
      },
      manifest: {
        name: 'Planet Digital Display',
        short_name: 'Planet Display',
        description: 'Planet tax-free refund promotional display',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#003087',
        icons: [
          { src: '/assets/planet-logo.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
    }),
  ],
})
