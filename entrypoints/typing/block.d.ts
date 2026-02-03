export interface Block {
  domain: string;
  /**
   * 是否拉黑
   */
  isBlock: boolean;
  /**
   * 重定向地址
   */
  redirectUrl: string;
}
