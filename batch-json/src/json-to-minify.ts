import { handleZip } from './utils/json2minifiedJson';
import register from './utils/register';

export default register({
  inputHandler: handleZip,
  lang: 'JSON',
});

export const advance = {
  recommend: {
    type: 'json',
    priority: 3,
  },
};
