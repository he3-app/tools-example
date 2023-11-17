import { transformTool } from '@he3-kit/utils';
import yaml from 'js-yaml';
import transform from 'transform-json-types';
import { yamlExample } from './utils/utils';
import { i18n } from './locale';
import { isYaml } from './isYaml';
export default transformTool({
  inputLang: 'YAML',
  outputLang: 'JSON',
  inputHandler: function yamlToIoTs(str: string) {
    try {
      const obj = yaml.load(str);
      const jsonStr = JSON.stringify(obj, null, 2);
      transform(jsonStr, {
        lang: 'io-ts',
      });
    } catch {
      window.$he3.message.error(i18n.global.t('yamlParseError'));
    }
    const obj = yaml.load(str);
    const jsonStr = JSON.stringify(obj, null, 2);
    return transform(jsonStr, {
      lang: 'io-ts',
    });
  }, //左边转右边函数
  sampleData: yamlExample, //初始列子
  autoFillInputCondition: isYaml,
});
