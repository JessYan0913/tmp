import { join } from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    emptyOutDir: true,
  },
  resolve: {
    alias: [
      { find: /^@tmp\/schema/, replacement: join(__dirname, '../packages/schema/src/index.ts') },
      { find: /^@tmp\/core/, replacement: join(__dirname, '../packages/core/src/index.ts') },
      { find: /^@tmp\/components/, replacement: join(__dirname, '../packages/components/src/index.ts') },
      { find: 'vue', replacement: join(__dirname, './node_modules/vue/dist/vue.esm-bundler.js') },
    ],
  },
  server: {
    fs: {
      strict: false,
    },
    host: '0.0.0.0',
    port: 8891,
    strictPort: true,
  },
});
