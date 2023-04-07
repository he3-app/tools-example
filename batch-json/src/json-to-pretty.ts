import prettyJson from 'json-stringify-pretty-compact';
import Decimal from 'decimal.js';
import { uglyJsonExample } from './example';
import register from './utils/register';

const toSafeJSON = (key, value) => {
  if (typeof value === 'number') {
    const decimalValue = new Decimal(value);
    return decimalValue.toString();
  }
  return value;
}

export default register({
  inputHandler: (str: string) => {
    const json = JSON.parse(str, (key, value) => {
      // 如果 value 是字符串类型并且可以转换为数字，则使用 Decimal 对象存储
      if (typeof value === 'string' && /^\d+$/.test(value)) {
        const decimalValue = new Decimal(value);
        return decimalValue.toNumber();
      }
      return value;
    });
    return prettyJson(json, { maxLength: 20, replacer: toSafeJSON });
  },
  lang: 'JSON',
  example: uglyJsonExample,
});

export const advance = {
  recommend: {
    type: 'json',
    priority: 5,
  },
};
