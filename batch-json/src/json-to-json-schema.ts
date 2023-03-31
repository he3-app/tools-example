import JSONToSchema from 'json-to-schema-fork';
import register from './utils/register';

export default register({
  inputHandler: (str: string) => {
    const json = JSON.parse(str);
    return JSON.stringify(JSONToSchema(json), null, 4);
  },
  lang: 'JSON',
});
