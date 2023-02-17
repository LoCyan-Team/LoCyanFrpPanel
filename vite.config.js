import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cssnanoPlugin from "cssnano";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
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
  }
});
