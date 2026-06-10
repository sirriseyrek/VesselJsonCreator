import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Full Screen Vue PWA',
        short_name: 'VuePWA',
        description: 'Tam ekran çalışan Vue PWA uygulaması',
        theme_color: '#4fc08d',
        background_color: '#ffffff',
        display: 'fullscreen', // Kurulduğunda tam ekran açılmasını sağlar
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})