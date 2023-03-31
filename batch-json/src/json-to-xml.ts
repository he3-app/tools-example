import { toXML } from 'jstoxml';
import register from './utils/register';

export default register({
  inputHandler: (str: string) => {
    const json = JSON.parse(str);
    const config = {
      indent: '    ',
    };
    return toXML(json, config);
  },
  lang: 'XML',
});
