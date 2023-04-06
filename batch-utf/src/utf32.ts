import { UInt32, UTF32Char } from 'utf32char';

export function decode(str: string): string {
  let res = '';
  const arr = str.split('U+');
  for (const numStr of arr) {
    if (numStr === '') {
      continue;
    }
    const num = Number.parseInt(numStr, 16);
    const u32num = new UInt32(num);
    const ch = UTF32Char.fromUInt32(u32num);
    res += ch.toString();
  }
  return res;
}

export function encode(str: string): string {
  let res = '';
  for (const element of str) {
    const ch = new UTF32Char(element);
    let enc = ch.toNumber().toString(16);
    const padding = 8 - enc.length;
    for (let j = 0; j < padding; j++) {
      enc = `0${enc}`;
    }
    res += `U+${enc}`;
  }
  return res;
}

export function isUtf32Encoded(contents: string): boolean {
  return /^(U\+[0-9a-f]{8})+$/.test(contents);
}
