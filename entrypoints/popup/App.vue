<script lang="ts" setup>
import { updateRules } from "../tools/net-rules.js";
import {
  findBlockUrl,
  findBlockUrlIndex,
  getActionTabs,
  getBlockList,
  setBlockUrl,
} from "../tools/utils.js";
import Setting from "./components/setting.vue";
import useMessage from "../tools/message.js";

const activeName = ref("first");

const actionUrl = ref<string>("");

const redirectUrl = ref<string>("");

const pullBlockList = async () => {
  if (await findBlockUrl(actionUrl.value)) {
    useMessage("该网站已被拉黑", "warning");
    return;
  }

  const blocklist = await getBlockList();
  blocklist.push({
    domain: actionUrl.value,
    redirectUrl: "",
  });

  await setBlockUrl(blocklist, actionUrl.value);
  updateRules();
};

const removeBlockList = async () => {
  let blockList = await getBlockList();

  const blockUrlIndex = await findBlockUrlIndex(actionUrl.value);

  if (blockUrlIndex != -1) {
    blockList.splice(blockUrlIndex, 1);
    setBlockUrl(blockList, actionUrl.value);
    updateRules();
    useMessage("移除成功", "success");
  } else {
    useMessage("该网站未被拉黑", "warning");
  }
};

const redirect = async () => {
  const blockUrlIndex = await findBlockUrlIndex(actionUrl.value);

  let blockList = await getBlockList();

  if (blockUrlIndex !== -1) {
    blockList[blockUrlIndex].redirectUrl = redirectUrl.value;
    setBlockUrl(blockList);
  } else {
    blockList.push({
      domain: actionUrl.value,
      redirectUrl: redirectUrl.value,
    });
    setBlockUrl(blockList);
  }
  useMessage("设置重定向成功", "success");
};

onMounted(async () => {
  actionUrl.value = (await getActionTabs()) as string;
});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  actionUrl.value = (await getActionTabs()) as string;
});
</script>

<template>
  <div class="size-60">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本功能" name="first">
        <div class="flex items-center justify-center flex-col">
          <el-space direction="vertical">
            <el-button type="primary" plain @click="pullBlockList"
              >拉入黑名单</el-button
            >
            <el-button type="info" plain @click="removeBlockList"
              >解除黑名单</el-button
            >
            <div class="border-[1px] border-solid border-slate-400 rounded p-2">
              <el-space direction="vertical">
                <el-input v-model="redirectUrl"></el-input>
                <el-button size="small" @click="redirect">重定向</el-button>
              </el-space>
            </div>
          </el-space>
        </div>
      </el-tab-pane>
      <el-tab-pane label="黑名单列表" name="second">second</el-tab-pane>
      <el-tab-pane label="高级设置" name="third">
        <Setting></Setting>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style>
.el-tabs__item {
  padding: 0 10px !important;
}

.el-tabs__nav {
  width: 100%;
}

.el-tabs__item {
  display: flex;
  flex: 0.33;
}
</style>
