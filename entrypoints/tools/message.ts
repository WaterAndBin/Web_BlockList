import { ElMessage, MessageType } from "element-plus";

const useMessage = (message: string, type: MessageType = "info") => {
  ElMessage({
    message,
    type,
  });
};

export default useMessage;
