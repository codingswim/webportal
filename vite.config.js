import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 配置路径别名（可选，但推荐，方便引入文件）
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // @ 指向 src 目录
    }
  },
  // 核心：配置 SCSS 预处理器
  css: {
    preprocessorOptions: {
      scss: {
        // 自动注入全局变量/混合器（多个文件用 ; 分隔）
        additionalData: `
          @import "@/styles/variables.scss";
          @import "@/styles/mixins.scss";
        `,
        // 可选：指定 SCSS 文件的查找路径
        includePaths: [path.resolve(__dirname, 'src/styles')]
      }
    }
  }
})