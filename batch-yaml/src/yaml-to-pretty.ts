import { transformTool } from '@he3-kit/utils';
import YAML from 'yaml';
import { uglyYamlExample } from './utils/utils';
import { isYaml } from './isYaml';
export default transformTool({
  inputLang: 'YAML',
  outputLang: 'JAVASCRIPT',
  inputHandler(str: string) {
    return YAML.stringify(YAML.parse(str));
  }, //左边转右边函数
  resultHandler(str: string) {
    const jsonString = JSON.stringify(YAML.parse(str));
    const minifiedJsonString = JSON.stringify(JSON.parse(jsonString));
    return YAML.stringify(JSON.parse(minifiedJsonString));
  },
  sampleData: uglyYamlExample, //初始列子
  autoFillInputCondition: isYaml,
});
