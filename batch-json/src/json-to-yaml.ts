import yaml, { JSON_SCHEMA } from 'js-yaml';
import prettyJson from 'json-stringify-pretty-compact';
import { ErrorLine, jsonToYaml } from './utils/json2Yaml';
import register from './utils/register';

export default register({
  inputHandler: jsonToYaml,
  resultHandler: (str: string) => {
    try {
      const obj = yaml.load(str, { schema: JSON_SCHEMA });
      return prettyJson(obj, { maxLength: 20 });
    } catch (err: any) {
      if (err.mark) {
        throw new (ErrorLine as any)(err.message, err.mark.line + 1);
      } else {
        throw new Error(err.message);
      }
    }
  },
  lang: 'YAML',
});

export const advance = {
  recommend: {
    type: 'json',
    priority: 4,
  },
};
