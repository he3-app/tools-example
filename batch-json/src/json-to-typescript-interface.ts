import json2ts from 'json2ts';
import { i18n } from './locale';
import register from './utils/register';

export default register({
  inputHandler: (str: string) => {
    try {
      JSON.parse(str);
    } catch {
      window.$he3.message.error(i18n.global.t('jsonParseError'));
    }
    return json2ts.convert(str);
  },
  lang: 'TYPESCRIPT',
});
