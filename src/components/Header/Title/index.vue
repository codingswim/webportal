<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
<template>
  <div class="title">
    <h1>Portal</h1>
    <span class="beta">{{ $t("message.beta") }}</span>
  </div>
</template>
<script setup lang="ts"></script>

<style scoped>
.title {
  display: flex;
}

.title h1 {
  font-size: clamp(24px, 5vw, 32px);
  font-weight: 600;
  color: #333;
}

.title .beta {
  font-size: clamp(12px, 2vw, 14px);
  font-weight: 400;
  color: #999;
  margin-left: 8px;
}
</style>
