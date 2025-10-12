import { findBlockList, setBlockUrl } from "../tools/utils.js";

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

  // 查找是否被拉入黑名单
  const findUrl = await findBlockList(url);

  if (findUrl) {
    return console.error("该网站已被拉入黑名单当中");
  } else {
    // 获取全部的地址
    let blockList = (await findBlockList()) || [];
    blockList.push(url);
    setBlockUrl(blockList);
  }
});
