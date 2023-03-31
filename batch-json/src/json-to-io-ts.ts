import transform from 'transform-json-types';
import register from './utils/register';
import { i18n } from './locale';

export default register({
  inputHandler: (str: string) => {
    try {
      transform(str, {
        lang: 'io-ts',
      });
    } catch {
      window.$he3.message.error(i18n.global.t('jsonParseError'));
    }
    return transform(str, {
      lang: 'io-ts',
    });
  },
  lang: 'JSON',
});
