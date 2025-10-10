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
 * @param {关键词} title_key string
 * @param {回调函数} callback function
 * @param {黑名单地址} url string
 * @returns 当传入url，则去查找该数据是否有，当有则返回，没有返回undefined，当不传url，则去查找所有的数据
 */
function findBlockList(title_key, callback, url) {
  chrome.storage.local.get([title_key], (result) => {
    if (result) {
      const res = result[title_key];

      if (!res) {
        callback(undefined);
      } else {
        if (url) {
          const blockUrl = res.find((items) => items === url);
          if (blockUrl) {
            console.log("已拉黑该网站");
          }
          callback(blockUrl);
        } else {
          callback(res);
        }
      }
    } else {
      console.error("暂未存储数据");
    }
  });
}

/**
 * 存储黑名单地址
 * @param {地址} url
 */
function setBlockUrl(url) {
  findBlockList(key, (value) => {
    console.log(value);
  });

  // chrome.storage.local.set({ web_blockList: list }, function (res) {
  //   console.log("拉黑该网站成功");
  //   // alert("拉黑该网站成功");
  //   // setTimeout(() => {
  //   //   chrome.tabs.reload({ bypassCache: false });
  //   // }, 1000);
  // });
}

function removeBlockUrl(url) {
  findBlockList(key, (value) => {
    console.log(value);
  });
}

document.getElementById("remove").addEventListener("click", async () => {
  console.log(await getCurrentTab());
});

document.getElementById("pull").addEventListener("click", async () => {
  const url = await getCurrentTab();

  if (url) {
    console.log("当前页面 URL:", url);
    findBlockList(
      key,
      (value) => {
        if (!value) {
          setBlockUrl(url);
        } else {
          setBlockUrl(url);
          // setBlockUrl([value]);
        }
      },
      url
    );
  } else {
    alert("当前页面无法加入到黑名单当中！");
  }
});
