import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'Gestor de Serviços Pro',
          short_name: 'Gestor Pro',
          description: 'Aplicativo de gestão de serviços e contratos para profissionais autônomos.',
          theme_color: '#137fec',
          background_color: '#101922',
          display: 'standalone',
          display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
          start_url: '/',
          orientation: 'portrait',
          id: '/',
          categories: ['productivity', 'business', 'utilities'],
          lang: 'pt-BR',
          dir: 'ltr',
          icons: [
            {
              src: 'pwa-icon.svg',
              sizes: '192x192 512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            }
          ],
          screenshots: [
            {
              src: 'pwa-icon.svg', // Placeholder, ideally should be real screenshots
              sizes: '512x512',
              type: 'image/svg+xml',
              form_factor: 'wide',
              label: 'Dashboard do Gestor Pro'
            },
            {
              src: 'pwa-icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              label: 'Gestor Pro Mobile'
            }
          ]
        },
        workbox: {
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}']
        }
      })
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
