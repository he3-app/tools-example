import { textTransformTool } from '@he3-kit/utils';
import { decode, encode } from './utf32';

export default textTransformTool({
  inputHandler: encode,
  resultHandler: decode,
});
