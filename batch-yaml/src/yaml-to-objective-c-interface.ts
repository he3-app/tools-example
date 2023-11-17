import { transformTool } from '@he3-kit/utils';
import yaml from 'js-yaml';
import { yamlExample } from './utils/utils';
import { isYaml } from './isYaml';
export default transformTool({
  inputLang: 'YAML',
  outputLang: 'OBJECTIVE_C',
  inputHandler: async function ObjectiveCInterface(str: string) {
    const obj = yaml.load(str);
    const jsonStr = JSON.stringify(obj, null, 2);
    return await window.$he3.jsonToOther('objective-c', jsonStr);
  }, //左边转右边函数
  sampleData: yamlExample, //初始列子
  autoFillInputCondition: isYaml,
});
