import prettyJson from 'json-stringify-pretty-compact';
import Decimal from 'decimal.js';
import { uglyJsonExample } from './example';
import register from './utils/register';

//将数字转换成高精度类型
const toSafeJSON = (key, value) => {
  if (typeof value === 'number') {
    const decimalValue = new Decimal(value);
    return decimalValue.toString();
  }
  return value;
}
//将json分段解析 提高性能
function* chunkify(str, size) {
  const chunks = Math.ceil(str.length / size);
  for (let i = 0, index = 0; i < chunks; ++i, index += size) {
    yield str.substr(index, size);
  }
}

export default register({
  inputHandler: (str: string) => {
    const chunkSize = 10000;
    const stream = chunkify(str, chunkSize);
    let json = '';

    for (const chunk of stream) {
      const parsedChunk = JSON.parse(chunk, (key, value) => {
        if (typeof value === 'string' && /^\d+$/.test(value)) {
          const decimalValue = new Decimal(value);
          return decimalValue.toNumber();
        }
        return value;
      });
      json += prettyJson(parsedChunk, { maxLength: 20, replacer: toSafeJSON });
    }

    return json;
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
