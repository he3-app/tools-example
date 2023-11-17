/** 用于实现报错时添加line信息 */
export function ErrorLine(
  this: {
    message: string;
    line: number;
  },
  message: string,
  line: number
) {
  this.message = message;
  this.line = line;
}
