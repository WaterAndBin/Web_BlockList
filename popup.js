function findBlockList(callback) {
  chrome.storage.local.get(["test"], (result) => {
    if (result) {
      callback(result.test);
    } else {
      console.error("暂未存储数据");
    }
  });
}

function setBlockList() {
  chrome.storage.local.set({ test: "333" }, function (res) {
    console.log("存储成功");
  });
}

function prevent() {}

document.getElementById("pull").addEventListener("click", function () {
  // 获取当前活动页面
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const url = tabs?.[0]?.url;
    if (url) {
      console.log("当前页面 URL:", url);
      setBlockList();
      findBlockList((value) => {
        console.log(value);
      });
    } else {
      alert("当前页面无法加入到黑名单当中！");
    }
  });
});
