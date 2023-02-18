import path from 'path';

import { defineConfig } from 'vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import vue from '@vitejs/plugin-vue';

import pkg from './package.json';

const deps = Object.keys(pkg.dependencies);

export default defineConfig({
  plugins: [vue(), vueSetupExtend()],

  resolve: {
    alias:
      process.env.NODE_ENV === 'production'
        ? []
        : [
            { find: /^@tmp\/utils/, replacement: path.join(__dirname, '../utils/src/index.ts') },
            { find: /^tmp\/h5-schema/, replacement: path.join(__dirname, '../h5-schema/src/index.ts') },
          ],
  },

  build: {
    cssCodeSplit: false,
    sourcemap: true,
    minify: false,
    target: 'esnext',
    lib: {
      entry: 'src/index.ts',
      name: 'TmpComponents',
      fileName: 'tmp-components',
    },
    rollupOptions: {
      external(id: string) {
        return (
          /^vue/.test(id) ||
          /^element-plus/.test(id) ||
          /^@tmp\//.test(id) ||
          deps.some((k) => new RegExp(`^${k}`).test(id))
        );
      },
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
        },
      },
    },
  },
});
