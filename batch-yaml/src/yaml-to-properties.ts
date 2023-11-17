import { transformTool } from '@he3-kit/utils';
import yaml, { JSON_SCHEMA } from 'js-yaml';
import prettyJson from 'json-stringify-pretty-compact';
import { propertiesYamlTo, yamlExample } from './utils/utils';
import { JSONToProperty, jsonToYaml, propertyToJSON } from './utils/utils';
import { ErrorLine } from './utils/ErrorLine';
import { isYaml } from './isYaml';
export default transformTool({
  inputLang: 'YAML',
  outputLang: 'PROPERTIES',
  inputHandler(str: string) {
    try {
      const obj = yaml.load(str, { schema: JSON_SCHEMA });
      return JSONToProperty(obj as { [x: string]: any }).join('\n');
    } catch (err: any) {
      if (err.mark) {
        throw new (ErrorLine as any)(err.message, err.mark.line + 1);
      } else {
        throw new Error(err.message);
      }
    }
  }, //左边转右边函数
  resultHandler(str: string) {
    return jsonToYaml(prettyJson(propertyToJSON(str), { maxLength: 20 }));
  }, //右边转左边函数
  sampleData: yamlExample, //初始列子
  autoFillInputCondition: isYaml,
});
