import { transformTool } from '@he3-kit/utils';
import yaml from 'js-yaml';
import JSONToSchema from 'json-to-schema-fork';
import { yamlExample } from './utils/utils';
import { isYaml } from './isYaml';
export default transformTool({
  inputLang: 'YAML',
  outputLang: 'JSON',
  inputHandler(str: string) {
    const obj = yaml.load(str);
    const jsonStr = JSON.stringify(obj, null, 2);
    const json = JSON.parse(jsonStr);
    return JSON.stringify(JSONToSchema(json), null, 4);
  }, //左边转右边函数
  sampleData: yamlExample, //初始列子
  autoFillInputCondition: isYaml,
});
