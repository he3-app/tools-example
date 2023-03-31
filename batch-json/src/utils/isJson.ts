export function isJson(text: string) {
  if (text.length < 30) {
    return false;
  }

  if (!text.trim().startsWith('{') && !text.trim().startsWith('\\{')) {
    return false;
  }

  try {
    JSON.parse(text);
  } catch {
    return false;
  }
  return true;
}
