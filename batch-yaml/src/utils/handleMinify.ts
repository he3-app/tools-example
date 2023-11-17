import { parse } from 'yaml';
export function handleMinify(str: string) {
  if (!str) {
    return '';
  }
  return JSON.stringify(parse(str));
}
