<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "./supabase";
import { ElLoading } from "element-plus";
import defaultFavicon from "./assets/portal.svg";

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
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  try {
    const res = await supabase.from("websites").select("*");
    if (!res.error && res.status === 200) {
      list.value = res.data;
    }
  } catch (error) {
    console.error("获取快捷方式列表失败:", error);
  } finally {
    loading.close();
  }
};

// 图片加载失败时隐藏图标
const handleImageError = (e, id) => {
  console.log("图片加载失败:", e.target.src);
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
  <div class="container">
    <div class="title">
      <h1>Hello 人 !</h1>
      拖拽
      搜索
      编辑
      删除
      改变背景颜色
      切换主题
      参考 https://webportal.vercel.app/

    </div>

    <div class="search">
      <input type="text" placeholder="请输入搜索内容" />
    </div>

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

      <!-- 新增快捷方式 -->
      <div class="website_item" @click="showModal = true">
        <div class="website_icon" style="font-size: 26px">
          <el-icon><Plus /></el-icon>
        </div>
        <div class="website_name">新增快捷方式</div>
      </div>
    </div>
  </div>

  <!-- Element Plus 对话框 -->
  <el-dialog v-model="showModal" title="添加快捷方式" width="512px" @close="closeModal">
    <el-form :model="form" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="form.name" placeholder="如：GitHub" />
      </el-form-item>
      <el-form-item label="网址">
        <el-input v-model="form.url" placeholder="如：https://github.com" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeModal">取消</el-button>
      <el-button
        type="primary"
        @click="saveWebsite"
        :disabled="!form.name.trim() || !form.url.trim()"
        :loading="saveLoading"
      >
        完成
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to bottom, #f0f3f7, #3df7de);
  text-align: center;
}

.title {
  padding-top: 10vh;
  font-size: 24px;
}

.search {
  margin-top: 5vh;
}

.search input {
  height: 48px;
  width: 720px;
  border-radius: 25px;
  background-color: #fff;
  padding: 0 20px;
}

.websites {
  width: 1000px;
  margin: 50px auto 0;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.website_item {
  width: 100px;
  height: 120px;

  background-color: rgba(0, 0, 0, 0.1);
  margin: 10px;
  border-radius: 6px;


  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.website_item:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}

.website_icon {
  width: 48px;
  height: 48px;
  border-radius: 25px;
  margin-bottom: 5px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.website_name {
  width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}
</style>
