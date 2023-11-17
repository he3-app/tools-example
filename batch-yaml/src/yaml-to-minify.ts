import { transformTool } from '@he3-kit/utils';
import yaml from 'js-yaml';
import { yamlExample } from './utils/utils';
import { handleMinify } from './utils/handleMinify';
import { isYaml } from './isYaml';
import YAML from 'yamljs';

// parse YAML string

export default transformTool({
  inputLang: 'YAML',
  outputLang: 'JSON',
  inputHandler(str: string) {
    const jsonString = JSON.stringify(YAML.parse(str));
    const minifiedJsonString = JSON.stringify(JSON.parse(jsonString));
    return YAML.stringify(JSON.parse(minifiedJsonString));
  },
  resultHandler(str: string) {
    return YAML.stringify(YAML.parse(str));
  }, //右边转左边函数
  sampleData: yamlExample, //初始列子
  autoFillInputCondition: isYaml,
});
