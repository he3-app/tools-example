import jsonToZod from 'json-to-zod';
import { i18n } from './locale';
import register from './utils/register';

export default register({
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
