import register from './utils/register';
import {JsonUnescape} from './example'
export default register({
    lang: 'JSON',
    example: JsonUnescape,
    inputHandler: function( str: string) {
        return str.replace(/\\/g, '')
  },
  resultHandler: function( str: string ) {
    return JSON.stringify(JSON.parse(str), null, 2).replace(/"/g, '\\"');
  }
});
