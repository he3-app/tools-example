import { transformTool } from '@he3-kit/utils';
import yaml from 'js-yaml';
import { yamlExample } from './utils/utils';
import { json2java } from './utils/javaBean';
import { isYaml } from './isYaml';
export default transformTool({
  inputLang: 'YAML',
  outputLang: 'JAVA',
  inputHandler(str: string) {
    const obj = yaml.load(str);
    const jsonStr = JSON.stringify(obj, null, 2);
    return json2java(jsonStr)
      ?.map((item) => item?.fileContent)
      .join('\r\n\r\n');
  }, //左边转右边函数
  sampleData: yamlExample, //初始列子
  autoFillInputCondition: isYaml,
});
