import { transformTool } from '@he3-kit/utils';
import yaml from 'js-yaml';
import { jsonToYaml, yamlGeneratorExample } from './utils/utils';
import { json_generator } from './utils/json_generator';
import { isYaml } from './isYaml';
export default transformTool({
  inputLang: 'YAML',
  outputLang: 'JSON',
  inputHandler(str: string) {
    const obj = yaml.load(str);
    const jsonStr = JSON.stringify(obj, null, 2);
    return jsonToYaml(json_generator(jsonStr));
  }, //左边转右边函数
  sampleData: jsonToYaml(JSON.stringify(yamlGeneratorExample, null, 2)), //初始列子
  autoFillInputCondition: isYaml,
});
