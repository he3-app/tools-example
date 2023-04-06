export function isUtf8Encoded(contents: string): boolean {
  return isUtf8Hex(contents) || isUtf8Html(contents);
}

export function isUtf8Hex(contents: string): boolean {
  return /^(\\x[0-9a-f]{2})+$/.test(contents);
}

export function isUtf8Html(contents: string): boolean {
  return /^(&#[0-9]{2,3};)+$/.test(contents);
}
