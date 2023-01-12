import { join, resolve } from 'path';

import { defineConfig, loadEnv } from 'vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const r = (p: string) => resolve(__dirname, p);
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: env.VITE_BASE_URL,
    plugins: [vue(), vueSetupExtend()],
    build: {
      emptyOutDir: true,
    },
    resolve: {
      alias: [
        { find: '@', replacement: r('./src') },
        { find: 'vue', replacement: join(__dirname, './node_modules/vue/dist/vue.esm-bundler.js') },
      ],
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    },
    server: {
      fs: {
        strict: false,
      },
      host: '0.0.0.0',
      port: 8890,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://192.168.100.12:8080',
          changeOrigin: true,
          rewrite(path: string): string {
            return path.replace(/\/api/, '');
          },
        },
      },
    },
  };
});
