import useMessage from "./tools/message";
import { updateRules } from "./tools/net-rules";

export default defineContentScript({
  matches: ["*://*/*"],
  async main(ctx) {
    // 你的“权限判断”逻辑 — 这里演示固定无权限
    const hasPermission = false;

    console.log("======");
    console.log(ctx);

    // if (!hasPermission) {
    //   // 清空 HTML
    //   document.documentElement.innerHTML = "";

    //   // 添加一个简单的 div 提示
    //   const div = document.createElement("div");
    //   div.style = `
    //     width: 100%;
    //     height: 100vh;
    //     display: flex;
    //     justify-content: center;
    //     align-items: center;
    //     background: white;
    //     color: black;
    //     font-size: 24px;
    //     text-align: center;
    //   `;
    //   div.textContent = "你没有权限访问该页面";

    //   document.body.appendChild(div);
    // }
  },
});
