import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  // envPrefix: '', // 设置环境变量前缀
  server: {
    host: '0.0.0.0',
    port: 8890,
    open: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 8891,
    open: true,
  },
  plugins: [
    vue(),
    eslintPlugin({
      exclude: ['./node_modules/**'],
      cache: false,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import '@/styles/index.scss';`,
      },
    },
  },
})
