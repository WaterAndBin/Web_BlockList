<script lang="ts" setup>
import { findBlockList, getActionTabs, setBlockUrl } from "../tools/utils.js";

const isBlock = ref<boolean>(false);

const actionUrl = ref<string>("");

const pullRef = ref<HTMLElement>();
const removeRef = ref<HTMLElement>();

const pullBlockList = async () => {
  if (await findBlockList(actionUrl.value)) return;

  const blocklist = (await findBlockList()) as string[];
  blocklist.push(actionUrl.value);

  await setBlockUrl(blocklist, actionUrl.value);
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
  } else {
    console.error("该网站未被拉黑过");
  }
};

const checkUrlBlock = async () => {
  const findResult = await findBlockList(actionUrl.value);

  if (findResult) {
    isBlock.value = true;
  }
};

onMounted(async () => {
  actionUrl.value = (await getActionTabs()) as string;
  checkUrlBlock();
});
</script>

<template>
  <div>
    <div class="container">
      <button id="pull" ref="pullRef" @click="pullBlockList">拉入黑名单</button>
      <button id="remove" ref="removeRef" @click="removeBlockList">
        解除黑名单
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100px;
}
</style>
