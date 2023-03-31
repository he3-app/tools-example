import jsonToZod from 'json-to-zod';
import { i18n } from './locale';
import transformTool from './utils/register';

export default transformTool({
  inputHandler: (str: string) => {
    try {
      jsonToZod(JSON.parse(str));
    } catch {
      window.$he3.message.error(i18n.global.t('common.jsonParseError'));
    }
    return jsonToZod(JSON.parse(str));
  },
  lang: 'JAVASCRIPT',
});
