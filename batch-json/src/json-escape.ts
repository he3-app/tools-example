import register from './utils/register';
import {JsonExample} from '@he3-kit/utils'
export default register({
    lang: 'JSON',
    example: JsonExample,
    inputHandler: function( obj: string) {
      return JSON.stringify(JSON.parse(obj), null, 2).replace(/"/g, '\\"');
  },
  resultHandler: function( str: string) {
    return str.replace(/\\/g, '')
  }
});
