import { updateRules } from "./tools/net-rules";
import { findRedirectUrl, getActionTabs } from "./tools/utils";

// 已经处理过的 tabId
const handledTabs = new Set<number>();

export default defineBackground(() => {
  browser.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    const url = await getActionTabs();
    const redirectUrl = await findRedirectUrl(url);

    // 只在页面加载完成时触发，不然会无限循环
    if (changeInfo.status !== "complete") return;

    if (redirectUrl && redirectUrl !== "") {
      browser.tabs.update({ url: redirectUrl });
    }
  });
});
