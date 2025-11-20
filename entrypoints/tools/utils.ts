import { ElMessage } from "element-plus";
import { Block } from "../typing/block";
import useMessage from "./message";

const key = "local:web_blockList";

export const getActionTabs = (): Promise<string> => {
  return new Promise((resolve) => {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs?.[0]?.url ?? "";

      if (url !== "") {
        const newUrl = new URL(url);

        console.log("====");
        console.log(url);
        console.log(newUrl);

        resolve(newUrl?.origin);
      } else {
        useMessage("网站有误！", "warning");
      }
    });
  });
};

export const getBlockList = async (): Promise<Block[]> => {
  const result = await storage.getItem<Block[]>(key);

  return result ?? [];
};

export const findBlockUrl = async (url: string): Promise<boolean> => {
  const blockList = await getBlockList();

  return blockList?.find((items) => items.domain === url) ? true : false;
};

export const findRedirectUrl = async (url: string): Promise<string> => {
  const blockList = await getBlockList();

  return blockList?.find((items) => items.domain === url)?.redirectUrl ?? "";
};

export const findBlockUrlIndex = async (url: string): Promise<number> => {
  const blockList = await getBlockList();

  return blockList?.findIndex((items) => items.domain === url);
};

export const setBlockUrl = async (
  blockList: Block[],
  url?: string
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
