import { jsonToToml } from './utils/json2Toml';
import {tomlToJson} from './utils/json2Toml'
import register from './utils/register';

export default register({
  inputHandler: jsonToToml,
  resultHandler: tomlToJson,
  lang: 'TOML',
});
