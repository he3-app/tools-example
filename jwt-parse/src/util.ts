export function isJWT(text: string) {
  const reg = /^e([A-Za-z0-9_-]+)\.e([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$/;
  return reg.test(text);
}
