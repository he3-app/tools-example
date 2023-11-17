import { transformTool } from '@he3-kit/utils';
import yaml from 'js-yaml';
import json2ts from 'json2ts';
import { yamlExample } from './utils/utils';
import { i18n } from './locale';
import { isYaml } from './isYaml';
export default transformTool({
  inputLang: 'YAML',
  outputLang: 'TYPESCRIPT',
  inputHandler(str: string) {
    const obj = yaml.load(str);
    const jsonStr = JSON.stringify(obj, null, 2);
    try {
      JSON.parse(jsonStr);
    } catch {
      window.$he3.message.error(i18n.global.t('yamlParseError'));
    }
    return json2ts.convert(jsonStr);
  }, //左边转右边函数
  sampleData: yamlExample, //初始列子
  autoFillInputCondition: isYaml,
});
