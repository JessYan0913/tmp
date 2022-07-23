import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  return {
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
      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_APP_TITLE,
          },
        },
      }),
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
  }
})
