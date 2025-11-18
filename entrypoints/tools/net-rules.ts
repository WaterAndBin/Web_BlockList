import { findBlockList } from "./utils";

/**
 * 更新规则
 */
export const updateRules = async () => {
  const urlPatterns = (await findBlockList()) as string[];
  const rules: globalThis.Browser.declarativeNetRequest.Rule[] =
    urlPatterns.map((pattern, index) => ({
      id: index + 1,
      priority: 1,
      action: { type: "block" },
      condition: {
        urlFilter: pattern,
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
