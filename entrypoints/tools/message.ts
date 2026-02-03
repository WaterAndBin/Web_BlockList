import { ElMessage, MessageHandler, MessageType } from "element-plus";

let messageInstance: MessageHandler | null = null;

const useMessage = (message: string, type: MessageType = "info") => {
  if (messageInstance) {
    messageInstance.close();
  }

  messageInstance = ElMessage({
    message,
    type,
  });
};

const handleMessages = (
  message: any,
  sender: Browser.runtime.MessageSender,
  sendResponse: (response?: any) => void,
) => {
  if (message?.isMessage) {
    useMessage("重定向成功", "success");
  }
};

browser.runtime.onMessage.addListener(handleMessages);

export default useMessage;
