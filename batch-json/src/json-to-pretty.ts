import prettyJson from 'json-stringify-pretty-compact';
import { uglyJsonExample } from './example';
import register from './utils/register';

export default register({
  inputHandler: (str: string) => {
    const json = JSON.parse(str);
    return prettyJson(json, { maxLength: 20 });
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
