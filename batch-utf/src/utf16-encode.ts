import { textTransformTool } from '@he3-kit/utils';
import { decode, encode } from './utf16';

const EXAMPLE_STR = `A Free, Modern Toolbox
Built for Developers.
`;

export default textTransformTool({
  inputHandler: encode,
  resultHandler: decode,
  sampleData: EXAMPLE_STR,
});
