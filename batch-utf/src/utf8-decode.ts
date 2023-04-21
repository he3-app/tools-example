import { textTransformTool } from '@he3-kit/utils';
import utf8 from 'utf8';
import { isUtf8Encoded } from './utf8';

const EXAMPLE_ENCODED =
  '\\x41\\x20\\x46\\x72\\x65\\x65\\x2c\\x20\\x4d\\x6f\\x64\\x65\\x72\\x6e\\x20\\x54\\x6f\\x6f\\x6c\\x62\\x6f\\x78\\x0a\\x42\\x75\\x69\\x6c\\x74\\x20\\x66\\x6f\\x72\\x20\\x44\\x65\\x76\\x65\\x6c\\x6f\\x70\\x65\\x72\\x73\\x2e';

const htmlRegExp = /&#(\d*);/;

const htmlIntoHex = (str: string) => {
  return str.replace(/&#(\d+);/g, (match, dec) => `\\x${Number.parseInt(dec).toString(16)}`);
};
const decode = (raw: string): string => {
  if (htmlRegExp.test(raw)) {
    raw = htmlIntoHex(raw);
  }
  return utf8.decode(eval(`'${raw}'`));
};
function formatSingle(ch: string): string {
    let t = ch.charCodeAt(0).toString(16);
    return t.length === 1 && (t = `0${t}`), `\\x${t}`
}
const encode = (str: string):string => {
  const result = utf8.encode(str);
  let ret = '';
  for (const element of result) {
    ret += formatSingle(element);
  }
 return ret
};
export default textTransformTool({
  inputHandler: decode,
  resultHandler: encode,
  sampleData: EXAMPLE_ENCODED,
  autoFillInputCondition: isUtf8Encoded,
});
