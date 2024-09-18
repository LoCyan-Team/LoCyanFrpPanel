import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import GitRevisionVitePlugin from 'git-revision-vite-plugin'
import cssnanoPlugin from 'cssnano'
import autoprefixer from 'autoprefixer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
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
    vueDevTools()
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
      '@': path.resolve('./src'), // @代替src
      '@views': path.resolve('./src/views'),
      '@components': path.resolve('./src/components'),
      '@router': path.resolve('./src/router/index.js')
    }
  },
  build: {
    rollupOptions: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          return 'vendor'
        }
      }
    }
  }
})
