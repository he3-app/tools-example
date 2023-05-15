export function parseErrorLine(message: string, str: string) {
  const num = (message as string).split('at position ')[1];
  if (num) {
    // 找到错误行后返回
    let index = Number.parseInt(num);
    const lineList = str.split('\n');
    for (const [i, element] of lineList.entries()) {
      index -= element.length;
      if (index <= i + 1) {
        throw new (ErrorLine as any)(message, i + 1);
      }
    }
  } else {
    throw new Error(message);
  }
}

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
