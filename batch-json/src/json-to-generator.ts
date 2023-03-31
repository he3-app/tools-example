import register from './utils/register';
import { json_generator } from './utils/json2Generator';
import { jsonGeneratorExample } from './example';

export default register({
  inputHandler: json_generator,
  example: JSON.stringify(jsonGeneratorExample, null, 2),
  lang: 'JSON',
});
