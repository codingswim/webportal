<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>

<template>
  <div class="search">
    <input type="text" :placeholder="t('message.pleaseInput')" />
  </div>
</template>

<style scoped>
/* 搜索框 - 响应式 */
.search {
  margin: 0 auto 32px;
  max-width: 720px;
  width: 100%;
}

.search input {
  height: clamp(40px, 8vw, 48px);
  width: 100%;
  border-radius: 25px;
  padding: 0 20px;
  border: 1px solid var(--border-color);
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: var(--text-color);

}
</style>
