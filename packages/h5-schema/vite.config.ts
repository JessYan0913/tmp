import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    sourcemap: true,

    lib: {
      entry: 'src/index.ts',
      name: 'TmpH5Schema',
      fileName: 'tmp-h5-schema',
    },
  },
});
