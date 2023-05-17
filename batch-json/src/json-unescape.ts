import register from './utils/register';
import {JsonUnescape} from './example'
export default register({
    lang: 'JSON',
    example: JsonUnescape,
    inputHandler: function( str: string) {
        return str.replace(/\\/g, '')
  },
});
