import GenerateSchema from 'generate-schema';
import register from './utils/register';
import { i18n } from './locale';
export default register({
  inputHandler: (str: string) => {
    try {
      GenerateSchema.bigquery(JSON.parse(str));
    } catch {
      window.$he3.message.error(i18n.global.t('jsonParseError'));
    }
    return JSON.stringify(GenerateSchema.bigquery(JSON.parse(str)), null, 2);
  },
  lang: 'JSON',
});
