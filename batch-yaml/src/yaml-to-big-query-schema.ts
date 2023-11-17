import { transformTool } from '@he3-kit/utils';
import GenerateSchema from 'generate-schema';
import yaml from 'js-yaml';
import { yamlExample } from './utils/utils';
import { i18n } from './locale';
import { isYaml } from './isYaml';
export default transformTool({
  inputLang: 'YAML',
  outputLang: 'JSON',
  inputHandler(str: string) {
    try {
      const obj = yaml.load(str);
      GenerateSchema.bigquery(obj);
    } catch {
      window.$he3.message.error(i18n.global.t('yamlParseError'));
    }
    const obj = yaml.load(str);
    return JSON.stringify(GenerateSchema.bigquery(obj), null, 2);
  }, //左边转右边函数
  sampleData: yamlExample, //初始列子
  autoFillInputCondition: isYaml,
});
