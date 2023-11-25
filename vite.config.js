import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cssnanoPlugin from "cssnano";
import autoprefixer from "autoprefixer";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            imports: [
                'vue',
                {
                    'naive-ui': [
                        'useDialog',
                        'useMessage',
                        'useNotification',
                        'useLoadingBar'
                    ]
                }
            ]
        }),
        Components({
            resolvers: [NaiveUiResolver()]
        })
    ],
    server: {
        host: "0.0.0.0"
    },
    css: {
        postcss: {
            plugins: [
                cssnanoPlugin(),
                autoprefixer()
            ]
        }
    },
    build: {
        rollupOptions: {
            manualChunks(id) {
                if (id.includes('node_modules')) {
                    return "vendor";
                }
            }
        }
    }
})