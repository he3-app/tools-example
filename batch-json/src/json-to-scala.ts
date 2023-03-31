import transform from 'transform-json-types';
import { i18n } from './locale';
import register from './utils/register';

export default register({
  inputHandler: (str: string) => {
    try {
      transform(str, {
        lang: 'scala',
      });
    } catch {
      window.$he3.message.error(i18n.global.t('jsonParseError'));
    }
    return transform(str, {
      lang: 'scala',
    });
  },
  lang: 'SCALA',
});
