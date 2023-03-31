import jsonToKotlinClass from 'json-to-kotlin-class';
import register from './utils/register';

export default register({
  inputHandler: (str: string) => {
    const json = JSON.parse(str);
    return jsonToKotlinClass.init(json);
  },
  lang: 'KOTLIN',
});
