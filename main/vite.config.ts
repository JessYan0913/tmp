import { join, resolve } from 'path';

import { defineConfig, loadEnv } from 'vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import typescript from '@rollup/plugin-typescript';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const r = (p: string) => resolve(__dirname, p);
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: env.VITE_BASE_URL,
    plugins: [vue(), typescript(), vueSetupExtend()],
    build: {
      emptyOutDir: true,
    },
    resolve: {
      alias: [
        { find: '@', replacement: r('./src') },
        { find: /^@tmp\/utils/, replacement: join(__dirname, '../packages/utils/src/index.ts') },
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
