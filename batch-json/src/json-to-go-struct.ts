import { Go } from './utils/json2Go';
import register from './utils/register';

export default register({
  lang: 'GO',
  inputHandler: (str: string) => {
    try {
      const stringArray = Go(str);
      const goString = stringArray.join('\r\n\r\n');
      return goString;
    } catch (e) {
      return e.message;
    }
  },
});
