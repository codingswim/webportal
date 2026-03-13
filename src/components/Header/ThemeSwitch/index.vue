<script setup>
import { ref, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { Sunny, Moon } from "@element-plus/icons-vue";

const { t } = useI18n();
const isDarkTheme = ref(false);

// 监听主题变化（添加过渡类，优化切换动画）
watch(isDarkTheme, (newValue) => {
  // 添加过渡类，确保样式平滑切换
  document.documentElement.classList.add("theme-transition");

  if (newValue) {
    document.documentElement.classList.add("dark-theme");
    localStorage.setItem("portal-theme", "dark");
  } else {
    document.documentElement.classList.remove("dark-theme");
    localStorage.setItem("portal-theme", "light");
  }

  // 过渡结束后移除过渡类（避免影响其他样式）
  setTimeout(() => {
    document.documentElement.classList.remove("theme-transition");
  }, 300);
});

// 组件挂载时初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem("portal-theme");
  if (savedTheme === "dark") {
    isDarkTheme.value = true;
    document.documentElement.classList.add("dark-theme");
  }
});
</script>

<template>
  <!-- 主题切换容器 -->
  <div class="theme-switch">
    <!-- 优化开关样式，更贴合主题风格 -->
    <el-switch
      v-model="isDarkTheme"
      :active-icon="Moon"
      :inactive-icon="Sunny"
      inline-prompt
      size="large"
      style="
        /* 浅色开关：清新蓝调，更有质感 */
        --el-switch-on-color: #4f46e5;
        --el-switch-off-color: #e0e7ff;
        --el-switch-on-border-color: #4f46e5;
        --el-switch-off-border-color: #e0e7ff;
        --el-switch-core-bg-color: #f8fafc;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      "
    />
  </div>
</template>

<style scoped>
.theme-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  /* 给容器加一点内边距，避免太紧凑 */
  padding: 4px 8px;
  border-radius: 8px;
  /* 跟随主题变化的背景 */
  background-color: var(--el-bg-color-light);
  transition: all 0.3s ease;
}

/* 修复图标颜色跟随主题 */
:deep(.el-switch__icon) {
  color: var(--el-text-color-primary);
}
</style>

<style>
/* 全局过渡动画：所有元素切换主题时平滑过渡 */
.theme-transition,
.theme-transition * {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* 浅色主题（默认）- 优化后的清新配色 */
:root {
  /* 主色调：柔和的蓝紫色，更现代 */
  --primary-color: #4f46e5;
  /* 页面背景：极浅的灰，不刺眼 */
  --background-color: #f8fafc;
  /* 主文本：深灰，比纯黑更柔和 */
  --text-color: #1e293b;
  /* 次要文本：中灰，提升层次 */
  --text-color-secondary: #64748b;
  /* 卡片背景：纯白，带轻微阴影 */
  --card-background: #ffffff;
  /* 边框色：极浅的灰，不突兀 */
  --border-color: #e2e8f0;
  /* 悬浮背景：浅蓝，呼应主色调 */
  --hover-background: #e0e7ff;
}

/* 深色主题 - 优化后的高级暗黑配色（避免纯黑，减少视觉疲劳） */
.dark-theme {
  /* 主色调：更亮的蓝紫色，在深色背景更突出 */
  --primary-color: #818cf8;
  /* 页面背景：深灰蓝，比纯黑更有质感 */
  --background-color: #0f172a;
  /* 主文本：浅灰，不刺眼 */
  --text-color: #f1f5f9;
  /* 次要文本：中灰，区分层次 */
  --text-color-secondary: #94a3b8;
  /* 卡片背景：深灰，比页面背景稍亮 */
  --card-background: #1e293b;
  /* 边框色：暗灰，弱化边框 */
  --border-color: #334155;
  /* 悬浮背景：深灰蓝，呼应主色调 */
  --hover-background: #334155;
}

/* ========== 全局样式适配 ========== */
body {
  background-color: var(--background-color);
  color: var(--text-color);
  transition: all 0.3s ease;
}

/* ========== 优化各组件样式 ========== */
/* 容器背景渐变：更自然的深色渐变 */
.dark-theme .container {
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%) !important;
}

/* 搜索框：优化深色模式下的质感 */
.dark-theme .search input {
  background-color: var(--card-background) !important;
  color: var(--text-color) !important;
  border-color: var(--border-color) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
  border-radius: 8px !important;
}

/* 网站快捷方式项：优化悬浮效果 */
.website_item {
  background-color: var(--card-background) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: 8px !important;
  transition: all 0.2s ease !important;
}

.dark-theme .website_item {
  background-color: rgba(30, 41, 59, 0.8) !important;
}

.website_item:hover {
  background-color: var(--hover-background) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

/* 对话框：优化深色模式样式 */
.dark-theme .el-dialog {
  background-color: var(--card-background) !important;
  color: var(--text-color) !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3) !important;
}

.dark-theme .el-dialog__header {
  border-bottom: 1px solid var(--border-color) !important;
}

/* 输入框：优化深色模式样式 */
.dark-theme .el-input__wrapper {
  background-color: var(--card-background) !important;
  color: var(--text-color) !important;
  border-color: var(--border-color) !important;
}

.dark-theme .el-input__wrapper input {
  color: var(--text-color) !important;
}

/* 按钮：优化深色模式样式 */
.dark-theme .el-button {
  --el-button-text-color: var(--text-color) !important;
  --el-button-hover-text-color: #ffffff !important;
}

.dark-theme .el-button--primary {
  --el-button-bg-color: var(--primary-color) !important;
  --el-button-border-color: var(--primary-color) !important;
  --el-button-hover-bg-color: #7c3aed !important;
  --el-button-hover-border-color: #7c3aed !important;
}

/* 修复Element Plus组件默认样式适配 */
.dark-theme .el-input__placeholder {
  color: var(--text-color-secondary) !important;
}

.dark-theme .el-dialog__title {
  color: var(--text-color) !important;
}
</style>
