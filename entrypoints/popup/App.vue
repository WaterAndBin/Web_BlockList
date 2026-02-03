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
import { Block } from "../typing/block";

const activeName = ref("first");

/**
 * 当前活动页地址
 */
const actionUrl = ref<string>("");

/**
 * 重定向地址
 */
const redirectUrl = ref<string>("");

/**
 * 是否被拉黑
 */
const isBlock = ref<boolean>(false);

const getOrCreateBlockItem = async (domain: string) => {
  const blockList = await getBlockList();
  const index = await findBlockUrlIndex(domain);

  let item;
  if (index !== -1) {
    item = blockList[index];
  } else {
    item = {
      domain,
      isBlock: false,
      redirectUrl: "",
    };
    blockList.push(item);
  }

  return { blockList, item };
};

/**
 * 拉黑
 */
const pullBlockList = async () => {
  const { blockList, item } = await getOrCreateBlockItem(actionUrl.value);

  if (item.isBlock) {
    useMessage("该网站已被拉黑", "warning");
    return;
  }

  item.isBlock = true;

  await setBlockUrl(blockList, actionUrl.value);
  updateRules();
  useMessage("拉黑成功", "warning");
};

/**
 * 移除拉黑
 */
const removeBlockList = async () => {
  const { blockList, item } = await getOrCreateBlockItem(actionUrl.value);

  if (!item.isBlock) {
    useMessage("该网站未被拉黑", "warning");
    return;
  }

  item.isBlock = false;

  await setBlockUrl(blockList, actionUrl.value);
  updateRules();
  useMessage("移除成功", "success");
};

const redirect = async () => {
  const { blockList, item } = await getOrCreateBlockItem(actionUrl.value);

  item.redirectUrl = redirectUrl.value;

  await setBlockUrl(blockList);
  updateRules();
  useMessage("设置重定向成功", "success");
};

const changeIsBlock = () => {
  isBlock.value ? pullBlockList() : removeBlockList();
};

/**
 * 检查当前网站的拉黑状态
 */
const checkBlockStatus = async () => {
  const res = (await findBlockUrl(actionUrl.value, "detail")) as Block;

  if (!res) {
    isBlock.value = false;
    redirectUrl.value = "";
  } else {
    isBlock.value = res.isBlock;
    redirectUrl.value = res?.redirectUrl ?? "";
  }
};

onMounted(async () => {
  actionUrl.value = (await getActionTabs()) as string;
  checkBlockStatus();
});

browser.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status === "loading") {
    actionUrl.value = (await getActionTabs()) as string;
    checkBlockStatus();
  }
});
</script>

<template>
  <div class="size-60">
    <el-tabs v-model="activeName" style="height: 100%">
      <el-tab-pane label="基本功能" name="first" style="height: 100%">
        <div class="h-full">
          <div class="h-full shadow-md">
            <div class="h-full w-full">
              <el-descriptions size="small" label-width="50" :column="1">
                <el-descriptions-item label="操作" align="right">
                  <el-switch
                    v-model="isBlock"
                    inline-prompt
                    style="
                      --el-switch-off-color: #13ce66;
                      --el-switch-on-color: #ff4949;
                    "
                    active-text="已拉黑"
                    inactive-text="未拉黑"
                    @change="changeIsBlock"
                  />
                </el-descriptions-item>
                <el-descriptions-item label="重定向" align="right">
                  <el-input
                    v-model="redirectUrl"
                    @blur="redirect"
                    size="small"
                    type="textarea"
                  ></el-input>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
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
  display: flex;
  flex: 0.33;
  padding: 0 10px !important;
  height: 30px !important;
  font-size: 13px !important;
}

.el-tabs__nav {
  width: 100%;
}
</style>
