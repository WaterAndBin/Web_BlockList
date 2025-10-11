const key = "web_blockList";

/**
 * 获取当前网页url
 */
const getCurrentTab = () => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
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
const findBlockList = (url = undefined, title_key = key) => {
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
const setBlockUrl = async (blockList) => {
  chrome.storage.local.set({ web_blockList: blockList }, function (res) {
    console.log("操作成功");
    // setTimeout(() => {
    //   chrome.tabs.reload({ bypassCache: false });
    // }, 1000);
  });
};

document.getElementById("remove").addEventListener("click", async () => {
  const url = await getCurrentTab();

  // 获取全部的地址
  let blockList = (await findBlockList()) || [];

  // 查找该网站是否有被拉黑
  const blockUrlIndex = blockList.findIndex((items) => items === url);

  if (blockUrlIndex != -1) {
    blockList.splice(blockUrlIndex, 1);
    setBlockUrl(blockList);
  } else {
    console.error("该网站未被拉黑过");
  }
});

document.getElementById("pull").addEventListener("click", async () => {
  const url = await getCurrentTab();

  const findUrl = findBlockList(url);
});
