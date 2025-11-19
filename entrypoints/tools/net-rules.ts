import { getBlockList } from "./utils";

/**
 * 更新规则
 */
export const updateRules = async () => {
  const urlPatterns = await getBlockList();
  const rules: globalThis.Browser.declarativeNetRequest.Rule[] =
    urlPatterns.map((pattern, index) => ({
      id: index + 1,
      priority: 1,
      action: { type: "block" },
      condition: {
        urlFilter: pattern.domain,
        resourceTypes: [
          "main_frame",
          "sub_frame",
          "script",
          "image",
          "stylesheet",
          "object",
          "xmlhttprequest",
          "other",
        ],
      },
    }));

  browser.declarativeNetRequest.getDynamicRules((oldRules) => {
    const oldRuleIds = oldRules.map((rule) => rule.id);
    browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: oldRuleIds,
      addRules: rules,
    });
  });
};
