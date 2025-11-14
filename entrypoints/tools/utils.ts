const key = "local:web_blockList";

export const getActionTabs = (): Promise<string | undefined> => {
  return new Promise((resolve) => {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs?.[0]?.url);
    });
  });
};

/**
 * 查找黑名单
 * @param url 地址
 * @param title_key 关键词，默认采用全局的 key
 * @returns 当传入url，则去查找该数据是否有，当有则返回，没有返回undefined，当不传url，则去查找所有的数据
 */
export const findBlockList = async (
  url: string | undefined = undefined,
  title_key: StorageItemKey = key
): Promise<string[] | boolean> => {
  const result: string[] | null = await storage.getItem(title_key);

  if (result) {
    if (url) {
      const blockUrl = result.find((items) => items === url);
      if (blockUrl) {
        console.log("已拉黑该网站");
        return true;
      }
      return false;
    }
  }

  return result ?? [];
};

export const setBlockUrl = async (blockList: string[], url?: string) => {
  await storage.setItem<string[]>(key, blockList);

  if (url) {
    const result = await findBlockList(url);

    if (result) {
      return true;
    }
    return false;
  }
};
