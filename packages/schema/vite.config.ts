import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    sourcemap: true,

    lib: {
      entry: 'src/index.ts',
      name: 'TmpSchema',
      fileName: 'tmp-schema',
    },
  },
});
