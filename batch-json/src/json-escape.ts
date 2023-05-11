import register from './utils/register';
import {JsonExample} from './example'
export default register({
    lang: 'JSON',
    example: JsonExample,
    inputHandler: function( obj: string) {
      return JSON.stringify(JSON.parse(obj), null, 2).replace(/"/g, '\\"');
  }
});
