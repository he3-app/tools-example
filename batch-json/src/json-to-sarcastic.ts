import transform from 'transform-json-types';
import register from './utils/register';
import { i18n } from './locale';

export default register({
  inputHandler: (str: string) => {
    try {
      transform(str, {
        lang: 'sarcastic',
      });
    } catch {
      window.$he3.message.error(i18n.global.t('jsonParseError'));
    }
    return transform(str, {
      lang: 'sarcastic',
    });
  },
  lang: 'JSON',
});
