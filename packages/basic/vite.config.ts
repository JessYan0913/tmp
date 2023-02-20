import path from 'path';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      outputDir: 'dist/types',
      include: ['src/**/*'],
      staticImport: true,
      insertTypesEntry: true,
    }),
  ],

  resolve: {
    alias:
      process.env.NODE_ENV === 'production'
        ? []
        : [{ find: /^@tmp\/utils/, replacement: path.join(__dirname, '../utils/src/index.ts') }],
  },

  build: {
    cssCodeSplit: false,
    sourcemap: true,
    minify: false,
    target: 'esnext',

    lib: {
      entry: 'src/index.ts',
      name: 'Basic',
      fileName: 'basic',
    },
  },
});
