const key = "web_blockList";

/**
 * 查找黑名单
 * @param url 地址
 * @param title_key 关键词，默认采用全局的 key
 * @returns 当传入url，则去查找该数据是否有，当有则返回，没有返回undefined，当不传url，则去查找所有的数据
 */
export const findBlockList = (url = undefined, title_key = key) => {
  return new Promise((resolve) => {
    chrome.storage.local.get(title_key, (result) => {
      if (result) {
        const res = result[title_key];

        if (!res) {
          resolve(undefined);
        } else {
          if (url) {
            const blockUrl = res.find((items) => items === url);
            if (blockUrl) {
              console.log("已拉黑该网站");
            }
            resolve(blockUrl);
          } else {
            resolve(res);
          }
        }
      } else {
        console.error("暂未存储数据");
      }
    });
  });
};

/**
 * 存储黑名单地址
 * @param url 地址
 * @returns
 */
export const setBlockUrl = async (blockList) => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: blockList }, function (res) {
      console.log("操作成功");
      // setTimeout(() => {
      //   chrome.tabs.reload({ bypassCache: false });
      // }, 1000);
      resolve(true);
    });
  });
};
