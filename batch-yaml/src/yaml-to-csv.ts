import { transformTool } from '@he3-kit/utils';
import yaml from 'js-yaml';
import { yamlExample } from './utils/utils';
import { isYaml } from './isYaml';
import { revert } from './utils/revert';
export default transformTool({
  inputLang: 'YAML',
  outputLang: 'MARKDOWN',
  inputHandler: function yamlToCSV(str: string) {
    const obj = yaml.load(str);
    const jsonStr = JSON.stringify(obj, null, 2);
    return revert(jsonStr);
  }, //左边转右边函数
  resultHandler(str: string) {
    const lines = str.split(/\r?\n/);
    const headers = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentLine = lines[i].split(',');

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentLine[j];
      }

      result.push(obj);
    }

    return JSON.stringify(result);
  },
  sampleData: yamlExample, //初始列子
  autoFillInputCondition: isYaml,
});
