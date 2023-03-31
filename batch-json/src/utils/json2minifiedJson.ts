export function handleZip(str: string) {
  if (!str) {
    return str;
  }
  try {
    return JSON.stringify(JSON.parse(str));
  } catch (e) {
    console.error(e);
    window.$he3.message.warn('请输入 JSON 格式字符');
    return str;
  }
}
