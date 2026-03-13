<template>
  <div class="header">
    <div class="header_left">
      <div class="title">
        <h1>Portal</h1>
        <span class="beta">{{ $t("message.beta") }}</span>
      </div>
    </div>
    <div class="header_right">
      <div class="langs">
        <!-- 语言切换 根据 localStorage 中的 lang 切换 -->
        <el-dropdown>
          <svg
            t="1773409874557"
            class="langs_icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="23265"
            :width="iconSize"
            :height="iconSize"
          >
            <path
              d="M549.12 643.008L440.768 535.936l1.28-1.28A747.52 747.52 0 0 0 600.32 256h125.056V170.688H426.688V85.376H341.376v85.312H42.688v84.928h476.608A670.4 670.4 0 0 1 384 484.288a667.52 667.52 0 0 1-98.56-142.912H200.128a749.312 749.312 0 0 0 127.168 194.56L110.08 750.08l60.608 60.544L384 597.376l132.736 132.672 32.384-87.04z m240.256-216.32H704l-192 512h85.376l47.744-128h202.688l48.192 128h85.376l-192-512z m-111.808 298.688l69.12-184.768 69.12 184.768h-138.24z"
              p-id="23266"
            ></path>
          </svg>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                :class="{ active: locale.value === 'zh-CN' }"
                @click="changeLang('zh-CN')"
                >中文</el-dropdown-item
              >
              <el-dropdown-item
                :class="{ active: locale.value === 'zh-TW' }"
                @click="changeLang('zh-TW')"
                >繁体中文</el-dropdown-item
              >
              <el-dropdown-item
                :class="{ active: locale.value === 'en-US' }"
                @click="changeLang('en-US')"
                >English</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { computed, onMounted } from "vue";

const { t, locale } = useI18n();

// 响应式图标尺寸
const iconSize = computed(() => {
  const screenWidth = window.innerWidth;
  return screenWidth < 768 ? 24 : 32; // 移动端24px，PC端32px
});

const changeLang = (lang) => {
  locale.value = lang;
  localStorage.setItem("portal-lang", lang);
};

// 初始化语言设置
onMounted(() => {
  const savedLang = localStorage.getItem("portal-lang");
  if (savedLang) {
    locale.value = savedLang;
  }
});
</script>

<style scoped>
/* 基础样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 头部容器 - 响应式布局 */
.header {
  width: 100%;
  height: clamp(60px, 10vw, 100px); /* 响应式高度：移动端60px，PC端100px */
  line-height: clamp(60px, 10vw, 100px); /* 行高跟随高度 */
  display: flex;
  justify-content: space-between;
  padding: 0 clamp(16px, 3vw, 32px); /* 响应式内边距 */
  position: relative;
  z-index: 10;
}

/* 左侧标题区域 */
.header_left {
  width: 50%;
  text-align: left;
}

.title {
  display: flex;
}

.title h1 {
  font-size: clamp(18px, 3vw, 24px); /* 响应式字体大小 */
  font-weight: 600;
  color: #333;
}

.beta {
  font-size: clamp(12px, 2vw, 14px);
  font-weight: 400;
  margin-left: 8px;
}

/* 右侧语言切换区域 */
.header_right {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  /* 靠右对齐 */
}

.header_right .langs {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.header_right .langs:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* 激活的语言选项样式 */
.active {
  color: #409eff;
  font-weight: 500;
}

/* 语言图标样式优化 */
.langs_icon {
  display: block;
  transition: transform 0.2s ease;
}

.langs:hover .langs_icon {
  transform: rotate(5deg);
}

/* 媒体查询 - 移动端优化 */
@media (max-width: 768px) {
  .header {
    height: 60px;
    line-height: 60px;
  }

  .title {
    font-size: 18px;
  }

  /* 优化Element Plus下拉菜单在移动端的显示 */
  :deep(.el-dropdown-menu) {
    font-size: 14px;
    min-width: 80px;
  }

  :deep(.el-dropdown-item) {
    padding: 8px 16px;
  }
}

/* 小屏手机适配 */
@media (max-width: 480px) {
  .header {
    padding: 0 16px;
  }

  .title {
    font-size: 16px;
  }
}

/* 修复Element Plus下拉菜单样式 */
:deep(.el-dropdown) {
  outline: none;
}

:deep(.el-dropdown-menu__item) {
  font-size: clamp(14px, 2vw, 16px);
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: #f5f7fa;
}
</style>
