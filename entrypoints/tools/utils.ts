import { ElMessage } from "element-plus";
import { Block } from "../typing/block";
import useMessage from "./message";

const key = "local:web_blockList";

/**
 * 获取当前地址
 */
export const getActionTabs = (): Promise<string> => {
  return new Promise((resolve) => {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs?.[0]?.url ?? "";

      if (url !== "") {
        const newUrl = new URL(url);
        resolve(newUrl?.origin);
      } else {
        useMessage("网站有误！", "warning");
      }
    });
  });
};

/**
 * 获取黑名单列表
 */
export const getBlockList = async (): Promise<Block[]> => {
  const result = await storage.getItem<Block[]>(key);

  return result ?? [];
};

/**
 * 查找黑名单地址
 * @param url 地址
 * @returns boolean
 */
export const findBlockUrl = async (
  url: string,
  methods = "bool",
): Promise<boolean | Block | undefined> => {
  const blockList = await getBlockList();
  const res = blockList?.find((items) => items.domain === url);

  if (methods === "detail") {
    return res;
  }

  return res ? true : false;
};

/**
 * 查找重定向地址
 * @param url 地址
 * @returns string 地址
 */
export const findRedirectUrl = async (url: string): Promise<string> => {
  const blockList = await getBlockList();

  return blockList?.find((items) => items.domain === url)?.redirectUrl ?? "";
};

/**
 * 查看黑名单地址的index
 */
export const findBlockUrlIndex = async (url: string): Promise<number> => {
  const blockList = await getBlockList();

  return blockList?.findIndex((items) => items.domain === url);
};

/**
 * 保存黑名单
 */
export const setBlockUrl = async (
  blockList: Block[],
  url?: string,
): Promise<boolean | void> => {
  await storage.setItem<Block[]>(key, blockList);

  if (url) {
    const result = await findBlockUrl(url);

    if (result) {
      return true;
    }
    return false;
  }
};
