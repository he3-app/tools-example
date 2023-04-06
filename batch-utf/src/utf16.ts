export function encode(inp: string) {
  let res = '';
  for (const element of inp) {
    let temp = element.charCodeAt(0).toString(16);
    if (temp.length === 1) {
      temp = `0${temp}`;
    }
    res += `\\u{${temp}}`;
  }
  return res;
}

export function decode(inp: string) {
  const cc = /\\u\{([0-9a-f]{2,})\}/g;

  const charCodes = [];
  const it = inp.matchAll(cc);
  for (let item = it.next(); !item.done; item = it.next()) {
    if (item.value.length >= 2) {
      charCodes.push(Number.parseInt(item.value[1], 16));
    }
  }
  return String.fromCharCode(...charCodes);
}

export function isUtf16Encoded(contents: string): boolean {
  return /^(\\u{[0-9a-f]{2,4}})+$/.test(contents);
}
