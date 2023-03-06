import { join } from 'path';

import { defineConfig } from 'vite';

import pkg from './package.json';

const deps = Object.keys(pkg.dependencies);

export default defineConfig({
  resolve: {
    alias: [{ find: /^@tmp\/utils/, replacement: join(__dirname, '../packages/utils/src/index.ts') }],
  },
  build: {
    cssCodeSplit: false,
    sourcemap: true,
    minify: false,
    target: 'esnext',
    lib: {
      entry: 'src/index.ts',
      name: 'TmpH5Core',
      fileName: 'tmp-h5-core',
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
