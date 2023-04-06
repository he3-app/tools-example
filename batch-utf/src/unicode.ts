export const decode = (str: string): string => {
  // unicode 编码范围为 \u000 - \ufffff
  const unicodeReg = /\\u([0-9a-fA-F]{3,5})/g;
  return str.replaceAll(unicodeReg, (match, dec) => {
    // 循环判断输出，如果不存在自动减位
    for (let i = dec.length; i > 2; i--) {
      const string = String.fromCodePoint(Number.parseInt(dec.slice(0, i), 16));
      if (string) {
        return string + dec.slice(i, dec.length);
      }
    }
    return match;
  });
};

export const encode = (str: string): string => {
  let result = '';
  for (const char of str) {
    const code = char.charCodeAt(0);
    if (code < 128) {
      result += char;
      continue;
    }
    result += `\\u${String(code.toString(16)).padStart(4, '0')}`;
  }
  return result;
};

export function likeUnicode(text: string) {
  return text.split('\\u').length >= 5;
}
