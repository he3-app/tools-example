import { transformTool } from '@he3-kit/utils';
import yaml, { JSON_SCHEMA } from 'js-yaml';
import prettyJson from 'json-stringify-pretty-compact';
import YAML from 'yaml';
import { yamlExample } from './utils/utils';
import { ErrorLine } from './utils/ErrorLine';
import { parseErrorLine } from './utils/utils';
import { isYaml } from './isYaml';
export default transformTool({
  inputLang: 'YAML',
  outputLang: 'JSON',
  inputHandler(str: string) {
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
  }, //左边转右边函数
  resultHandler(str: string) {
    try {
      const json = JSON.parse(str);
      const doc = new YAML.Document();
      doc.contents = json;
      return doc.toString();
    } catch (e: any) {
      parseErrorLine(e.message, str);
    }
  }, //右边转左边函数
  sampleData: yamlExample, //初始列子
  autoFillInputCondition: isYaml,
});

export const advance = {
  recommend: {
    type: 'yaml',
    priority: 4,
  },
};
