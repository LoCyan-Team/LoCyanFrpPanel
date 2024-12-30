import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import GitRevisionVitePlugin from 'git-revision-vite-plugin'
import cssnanoPlugin from 'cssnano'
import autoprefixer from 'autoprefixer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    GitRevisionVitePlugin({
      commitHashCommand: 'rev-parse --short HEAD'
    }),
    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
        }
      ]
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    }),
  ],
  server: {
    host: '0.0.0.0'
  },
  css: {
    postcss: {
      plugins: [cssnanoPlugin(), autoprefixer()]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@router': fileURLToPath(new URL('./src/router/index.js', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 1024
  }
})
