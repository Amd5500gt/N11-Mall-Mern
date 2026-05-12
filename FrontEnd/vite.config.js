import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'

import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({

  plugins: [

    react(),

    VitePWA({

      registerType: 'autoUpdate',

      includeAssets: [

        'favicon.svg',
        'robots.txt',
        'apple-touch-icon.png'

      ],

      manifest: {

        name: 'NexXcart',

        short_name: 'NexXcart',

        description:
          'Modern Shopping Platform',

        theme_color: '#22c55e',

        background_color: '#ffffff',

        display: 'standalone',

        orientation: 'portrait',

        scope: '/',

        start_url: '/',

        icons: [

          {

            src: '/pwa-192x192.png',

            sizes: '192x192',

            type: 'image/png'

          },

          {

            src: '/pwa-512x512.png',

            sizes: '512x512',

            type: 'image/png'

          }

        ]

      }

    })

  ]

})