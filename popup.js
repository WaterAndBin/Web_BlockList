const key = "web_blockList";

/**
 * 查找黑名单
 * @param {关键词} title_key string
 * @param {黑名单地址} url string
 * @param {回调函数} callback function
 */
function findBlockList(title_key, url, callback) {
  chrome.storage.local.get([title_key], (result) => {
    if (result) {
      const res = result[title_key];

      if (!res) {
        callback(result[title_key]);
      } else {
        // const blockUrl = res.find((items)=>)
      }
    } else {
      console.error("暂未存储数据");
    }
  });
}

/**
 *
 * @param {列表} list
 */
function setBlockList(list) {
  chrome.storage.local.set({ web_blockList: list }, function (res) {
    console.log("拉黑该网站成功");
    // alert("拉黑该网站成功");
    // setTimeout(() => {
    //   chrome.tabs.reload({ bypassCache: false });
    // }, 1000);
  });
}

function prevent() {}

document.getElementById("pull").addEventListener("click", function () {
  // 获取当前活动页面
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const url = tabs?.[0]?.url;
    if (url) {
      console.log("当前页面 URL:", url);
      findBlockList(key, (value) => {
        if (!value) {
          setBlockList([url]);
        } else {
          // setBlockList([value]);
        }
      });
    } else {
      alert("当前页面无法加入到黑名单当中！");
    }
  });
});
