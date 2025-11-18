<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { updateRules } from "../tools/net-rules.js";
import { findBlockList, getActionTabs, setBlockUrl } from "../tools/utils.js";

const actionUrl = ref<string>("");

const redirectUrl = ref<string>("");

const pullBlockList = async () => {
  if (await findBlockList(actionUrl.value)) return;

  const blocklist = (await findBlockList()) as string[];
  blocklist.push(actionUrl.value);

  await setBlockUrl(blocklist, actionUrl.value);
  updateRules();
  ElMessage.success("拉黑成功");
};

const removeBlockList = async () => {
  // 获取全部的地址
  let blockList = ((await findBlockList()) as string[]) || [];

  // 查找该网站是否有被拉黑
  const blockUrlIndex = blockList.findIndex(
    (items) => items === actionUrl.value
  );

  if (blockUrlIndex != -1) {
    blockList.splice(blockUrlIndex, 1);
    setBlockUrl(blockList, actionUrl.value);
    updateRules();
    ElMessage.success("移除成功");
  } else {
    ElMessage.warning("该网站未被拉黑");
  }
};

onMounted(async () => {
  actionUrl.value = (await getActionTabs()) as string;
});
</script>

<template>
  <div>
    <div class="size-50 flex items-center justify-center flex-col">
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
            <el-button size="small">重定向</el-button>
          </el-space>
        </div>
      </el-space>
    </div>
  </div>
</template>
