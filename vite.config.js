import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// 引入打包分析插件
import { visualizer } from 'rollup-plugin-visualizer'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),

    // 自动导入 Element Plus 组件的相关配置
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),

    visualizer({
      open: true, // 自动打开浏览器查看分析结果
      filename: 'dist/stats.html', // 输出文件路径
      gzipSize: true,      // 显示 gzip 大小
      brotliSize: true,   // 显示 brotli 大小  
      template: 'treemap',

    })],

  // 配置路径别名
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
          @use "@/styles/variables.scss" as *;
          @use "@/styles/mixins.scss" as *;
        `,
        // 可选：指定 SCSS 文件的查找路径
        includePaths: [path.resolve(__dirname, 'src/styles')]
      }
    }
  }
})