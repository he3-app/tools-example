import YAML from 'yaml';
function isJson(text: string) {
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
export function isYaml(text: string) {
  if (text.length < 30) {
    return false;
  }

  if (text.search(': ') === -1 || text.split('\n').length <= 1 || isJson(text)) {
    return false;
  }

  try {
    YAML.parse(text);
  } catch {
    return false;
  }
  return true;
}
