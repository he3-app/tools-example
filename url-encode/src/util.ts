export function isUrl(url: unknown) {
  if (typeof url !== 'string' || !url || url.length <= 0) return false;

  const reg = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/;

  return reg.test(url);
}
