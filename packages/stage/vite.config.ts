import { join } from 'path';

import { defineConfig } from 'vite';

import pkg from './package.json';

const deps = Object.keys(pkg.dependencies);

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@tmp\/schema/, replacement: join(__dirname, '../packages/schema/src/index.ts') },
      { find: /^@tmp\/utils/, replacement: join(__dirname, '../packages/utils/src/index.ts') },
    ],
  },
  build: {
    cssCodeSplit: false,
    sourcemap: true,
    minify: false,
    target: 'esnext',
    lib: {
      entry: 'src/index.ts',
      name: 'TmpStage',
      fileName: 'tmp-stage',
    },
    rollupOptions: {
      external(id: string) {
        return deps.some((k) => new RegExp(`^${k}`).test(id));
      },
      output: {
        globals: {
          axios: 'axios',
        },
      },
    },
  },
});
