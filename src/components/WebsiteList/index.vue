<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";
import {
  ElLoading,
  ElIcon,
  ElButton,
  ElInput,
  ElForm,
  ElFormItem,
  ElDialog,
} from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import defaultFavicon from "@/assets/portal.svg";

// 定义props
const props = defineProps({
  // 可以根据需要添加props
});

// 定义emits
const emit = defineEmits([
  // 可以根据需要添加事件
]);

const showModal = ref(false);
const form = ref({
  name: "",
  url: "",
});

const list = ref([]);
const saveLoading = ref(false);
const failedIcons = ref([]); // 记录加载失败的图标 id

const gotoWebsite = (item) => {
  window.open(item.url, "_blank");
};

const closeModal = () => {
  showModal.value = false;
  form.value = { name: "", url: "" };
};

const saveWebsite = async () => {
  saveLoading.value = true;
  try {
    const res = await supabase.from("websites").insert([
      {
        name: form.value.name.trim(),
        url: form.value.url.trim(),
      },
    ]);

    if (!res.error) {
      closeModal();
      await fetchList();
    }
  } catch (error) {
    console.error("保存快捷方式失败:", error);
  } finally {
    saveLoading.value = false;
  }
};

onMounted(async () => {
  await fetchList();
});

const fetchList = async () => {
//   const loading = ElLoading.service({
//     lock: true,
//     text: "Loading",
//     background: "rgba(0, 0, 0, 0.7)",
//   });
  try {
    const res = await supabase.from("websites").select("*");
    if (!res.error && res.status === 200) {
      list.value = res.data;
    }
  } catch (error) {
    console.error("获取快捷方式列表失败:", error);
  } finally {
    // loading.close();
  }
};

// 图片加载失败时隐藏图标
const handleImageError = (e, id) => {
  e.target.style.display = "none";
  failedIcons.value.push(id);
};

// 生成 favicon URL
const getFaviconUrl = (domain) => {
  try {
    const urlObj = new URL(domain.startsWith("http") ? domain : `https://${domain}`);
    const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;
    return `${baseUrl}/favicon.ico`;
  } catch (e) {
    console.error("无效的URL:", domain);
    return "";
  }
};
</script>

<template>
  <div>
    <div class="websites">
      <div
        v-for="item in list"
        :key="item.id"
        class="website_item"
        @click="gotoWebsite(item)"
      >
        <div class="website_icon">
          <img
            v-if="!failedIcons.includes(item.id)"
            :src="getFaviconUrl(item.url)"
            alt=""
            class="favicon"
            @error="handleImageError($event, item.id)"
          />
          <img v-else :src="defaultFavicon" alt="" class="favicon" />
        </div>
        <div class="website_name">{{ item.name }}</div>
      </div>

      <div class="website_item" @click="showModal = true">
        <div class="website_icon">
          <el-icon size="26"><Plus /></el-icon>
        </div>
        <div class="website_name">
          {{ $t("message.addShortcut") }}
        </div>
      </div>
    </div>

    <!-- Element Plus 对话框 -->
    <el-dialog
      v-model="showModal"
      :title="$t('message.addShortcut')"
      :width="'512px'"
      @close="closeModal"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item :label="$t('message.name')">
          <el-input
            v-model="form.name"
            :placeholder="$t('message.example') + '：GitHub'"
          />
        </el-form-item>
        <el-form-item :label="$t('message.url')">
          <el-input
            v-model="form.url"
            :placeholder="$t('message.example') + '：https://github.com'"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button style="padding: 0 16px" @click="closeModal">{{
          $t("message.cancel")
        }}</el-button>
        <el-button
          type="primary"
          style="padding: 0 16px"
          @click="saveWebsite"
          :disabled="!form.name.trim() || !form.url.trim()"
          :loading="saveLoading"
        >
          {{ $t("message.save") }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
/* 网站列表容器 - 响应式布局 */
.websites {
  text-align: center;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px; /* 使用gap替代margin，更现代的布局方式 */
  padding-bottom: 40px;
}

/* 网站项 - 响应式尺寸 */
.website_item {
  flex: 0 0 clamp(80px, 20vw, 100px); /* 最小80px，最大100px，中间自适应 */
  height: clamp(100px, 25vw, 120px);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.website_item:hover {
  /* 鼠标悬停时悬浮 */
  transform: scale(1.05);

  /* 鼠标悬停时改变边框颜色 */
  border-color: var(--primary-color);
}

/* 图标容器 */
.website_icon {
  width: clamp(40px, 10vw, 48px);
  height: clamp(40px, 10vw, 48px);
  border-radius: 50%;
  margin-bottom: 8px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favicon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 网站名称 */
.website_name {
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: clamp(12px, 2.5vw, 14px);
  color: var(--text-color);
}

/* 媒体查询 - 针对移动端优化 */
@media (max-width: 768px) {
  .websites {
    gap: 12px;
  }

  .website_item {
    flex: 0 0 calc(25% - 12px); /* 移动端每行4个 */
    height: 100px;
  }

  /* 适配更小的屏幕（手机） */
  @media (max-width: 480px) {
    .website_item {
      flex: 0 0 calc(33.33% - 12px); /* 小屏每行3个 */
    }
  }
}

/* 修复Element Plus对话框在移动端的样式 */
:deep(.el-dialog) {
  margin: 0 auto;
  max-width: 95%;
}

:deep(.el-dialog__body) {
  padding: 16px;
}

:deep(.el-form-item__label) {
  font-size: 14px;
}

:deep(.el-input) {
  font-size: 14px;
}
</style>
