import { transformTool } from '@he3-kit/utils';
import yaml from 'js-yaml';
import { toXML } from 'jstoxml';
import { yamlExample } from './utils/utils';
import { isYaml } from './isYaml';
export default transformTool({
  inputLang: 'YAML',
  outputLang: 'XML',
  inputHandler(str: string) {
    const obj = yaml.load(str);
    const jsonStr = JSON.stringify(obj, null, 2);
    const json = JSON.parse(jsonStr);
    const config = {
      indent: '    ',
    };
    return toXML(json, config);
  }, //左边转右边函数
  sampleData: yamlExample, //初始列子
  autoFillInputCondition: isYaml,
});
