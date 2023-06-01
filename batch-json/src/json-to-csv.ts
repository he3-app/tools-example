import { revert } from './utils/json2Csv';
import register from './utils/register';

export default register({
  inputHandler: revert,
  lang: 'CSV',
});
