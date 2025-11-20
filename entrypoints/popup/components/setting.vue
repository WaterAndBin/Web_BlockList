<script lang="ts" setup>
import useMessage from "@/entrypoints/tools/message";
import { updateRules } from "@/entrypoints/tools/net-rules";
import { setBlockUrl } from "@/entrypoints/tools/utils";

const defaultSettingConfig = {
  isDisabled: false,
  isRedirect: false,
};
const settingConfig = reactive({
  ...defaultSettingConfig,
});

const clearAll = () => {
  setBlockUrl([]);
  updateRules();
  useMessage("清除成功", "success");
};
</script>

<template>
  <div>
    <el-descriptions :column="1" direction="horizontal" :label-width="84">
      <el-descriptions-item label="清除所有数据">
        <el-button size="small" @click="clearAll">清除数据</el-button>
      </el-descriptions-item>
      <el-descriptions-item label="禁用所有功能">
        <el-switch size="small" v-model="settingConfig.isDisabled" />
      </el-descriptions-item>
      <el-descriptions-item label="禁用重定向">
        <el-switch size="small" v-model="settingConfig.isDisabled" />
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<style>
.el-descriptions__label {
  text-align: right;
}

.el-descriptions__cell {
  display: flex;
  align-items: center;
}
</style>
