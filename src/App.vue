<script setup>
import { ref, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { ElLoading } from "element-plus";
import { useWebsiteStore } from "@/stores/website";
import Header from "./components/Header/index.vue";
import SearchInput from "./components/SearchInput/index.vue";
import WebsiteList from "./components/WebsiteList/index.vue";

const websiteStore = useWebsiteStore();

const { t, locale } = useI18n();
// 根据当前时间获取问候语
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) {
    return t("message.goodNight");
  } else if (hour < 12) {
    return t("message.goodMorning");
  } else if (hour < 14) {
    return t("message.goodNoon");
  } else if (hour < 18) {
    return t("message.goodAfternoon");
  } else {
    return t("message.goodEvening");
  }
};

// 计算属性，用于响应式更新问候语
const greeting = ref(getGreeting());

// 监听语言变化，当语言切换时立即更新问候语
watch(
  locale,
  () => {
    greeting.value = getGreeting();
  },
  { immediate: true }
);

// 监听 loading 变化
watch(
  () => websiteStore.loading,
  (newLoading, oldLoading) => {
    const loading = ElLoading.service({
      lock: true,
      text: "Loading",
      background: "rgba(0, 0, 0, 0.1)",
    });
    if (!newLoading && oldLoading) {
      loading.close();
    }
  }
);

// 组件挂载时设置定时器，每分钟更新一次问候语
onMounted(() => {
  // 初始更新
  greeting.value = getGreeting();

  // 设置定时器，每分钟更新一次
  setInterval(() => {
    greeting.value = getGreeting();
  }, 60000); // 60秒 = 1分钟
});
</script>
<!-- 拖拽 参考 https://webportal.vercel.app/ -->

<template>
  <div class="container">
    <Header />
    <h1>{{ greeting }}</h1>
    <p>{{ t("message.lyric") }}</p>
    <SearchInput />
    <WebsiteList />
    <el-backtop
      :right="50"
      :bottom="120"
      :style="{ background: 'var(--primary-color)', color: '#fff' }"
    />
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  width: 100%;
}

h1 {
  text-align: center;
  color: var(--text-color);
  margin: 10px 0 20px;
  font-size: clamp(16px, 5vw, 24px);
  font-weight: 500;
}

p {
  text-align: center;
  color: var(--text-color);
  margin: 20px auto 40px;
  font-size: clamp(12px, 5vw, 16px);
  width: 90%;
}
</style>
