<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { updateRules } from "../tools/net-rules.js";
import {
  findBlockUrl,
  findBlockUrlIndex,
  getActionTabs,
  getBlockList,
  setBlockUrl,
} from "../tools/utils.js";

const actionUrl = ref<string>("");

const redirectUrl = ref<string>("");

const pullBlockList = async () => {
  if (await findBlockUrl(actionUrl.value)) {
    ElMessage.warning("该网站已被拉黑");
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
    ElMessage.success("移除成功");
  } else {
    ElMessage.warning("该网站未被拉黑");
  }
};

const redirect = async () => {
  const blockUrlIndex = await findBlockUrlIndex(actionUrl.value);
  let blockList = await getBlockList();

  if (blockUrlIndex !== -1) {
    blockList[blockUrlIndex].redirectUrl = redirectUrl.value;
    setBlockUrl(blockList);
    ElMessage.warning("");
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
            <el-button size="small" @click="redirect">重定向</el-button>
          </el-space>
        </div>
      </el-space>
    </div>
  </div>
</template>
