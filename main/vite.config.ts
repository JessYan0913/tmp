import { join, resolve } from 'path';

import { defineConfig, loadEnv } from 'vite';
import glsl from 'vite-plugin-glsl';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const r = (p: string) => resolve(__dirname, p);
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: env.VITE_BASE_URL,
    plugins: [vue(), vueSetupExtend(), glsl()],
    build: {
      emptyOutDir: true,
    },
    resolve: {
      alias: [
        { find: '@', replacement: r('./src') },
        { find: /^@tmp\/utils/, replacement: join(__dirname, '../packages/utils/src/index.ts') },
        { find: /^@tmp\/3d-engine/, replacement: join(__dirname, '../packages/3d-engine/src/index.ts') },
        { find: /^@tmp\/h5-schema/, replacement: join(__dirname, '../packages/h5-schema/src/index.ts') },
        { find: /^@tmp\/h5-core/, replacement: join(__dirname, '../packages/h5-core/src/index.ts') },
        { find: /^@tmp\/components/, replacement: join(__dirname, '../packages/components/src/index.ts') },
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
          target: 'https://imgtg.com/json',
          changeOrigin: true,
          rewrite(path: string): string {
            return path.replace(/\/api/, '');
          },
        },
      },
    },
  };
});
