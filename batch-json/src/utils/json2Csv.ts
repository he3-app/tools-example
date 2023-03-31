import { parse as csvParse } from 'json2csv/dist/json2csv.umd.js';

export function revert(str: string) {
  let value = '';
  try {
    value = JSON.parse(str);
  } catch {
    return str;
  }
  try {
    const csv = csvParse(value, {});
    return csv.replace(/\"/g, '');
  } catch {
    return str;
  }
}
