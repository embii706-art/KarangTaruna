import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        tailwindcss(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['logo.svg', 'robots.txt'], // Assuming logo.svg exists in public
          manifest: {
            name: 'KARTEJI App',
            short_name: 'KARTEJI',
            description: 'Aplikasi Manajemen Karang Taruna',
            theme_color: '#0f172a',
            background_color: '#ffffff',
            display: 'standalone',
            orientation: 'portrait',
            start_url: '.',
            icons: [
              {
                src: 'logo.svg', // Using SVG as fallback/main if supported, ideally PNGs are needed but this is a start
                sizes: 'any',
                type: 'image/svg+xml',
                purpose: 'any maskable'
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ""),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || "")
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
