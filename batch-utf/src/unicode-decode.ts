import { textTransformTool } from '@he3-kit/utils';
import { decode, encode, likeUnicode } from './unicode';

const sampleData = '\\u6c26\\u4e09\\u79d1\\u6280';

export default textTransformTool({
  inputHandler: decode,
  resultHandler: encode,
  sampleData,
  autoFillInputCondition: likeUnicode,
});
