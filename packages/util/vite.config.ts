import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import pkg from './package.json';

const deps = Object.keys(pkg.dependencies);

export default defineConfig({
  plugins: [
    dts({
      outputDir: 'dist/types',
      include: ['src/**/*'],
      staticImport: true,
      insertTypesEntry: true,
    }),
  ],

  build: {
    cssCodeSplit: false,
    sourcemap: true,
    minify: false,
    target: 'esnext',

    lib: {
      entry: 'src/index.ts',
      name: 'Utils',
      fileName: 'utils',
    },

    rollupOptions: {
      external(id: string) {
        return deps.some((k) => new RegExp(`^${k}`).test(id));
      },
    },
  },
});
