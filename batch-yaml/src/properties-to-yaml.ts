import { transformTool } from '@he3-kit/utils';
import prettyJson from 'json-stringify-pretty-compact';
import yaml, { JSON_SCHEMA } from 'js-yaml';
import { propertiesExample } from './utils/utils';
import { JSONToProperty, jsonToYaml, propertyToJSON } from './utils/utils';
import { ErrorLine } from './utils/ErrorLine';
import { isYaml } from './isYaml';
export default transformTool({
  inputLang: 'PROPERTIES',
  /** 输出语法格式 */
  outputLang: 'YAML',
  inputHandler(str: string) {
    return jsonToYaml(prettyJson(propertyToJSON(str), { maxLength: 20 }));
  },
  /** 输出转换函数 */
  resultHandler(str: string) {
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
  },
  /** 默认值 */
  sampleData: propertiesExample,
  autoFillInputCondition: isYaml,
});
