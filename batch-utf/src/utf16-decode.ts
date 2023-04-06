import { textTransformTool } from '@he3-kit/utils';

import { decode, encode, isUtf16Encoded } from './utf16';

const EXAMPLE_ENCODED = `\\u{41}\\u{20}\\u{46}\\u{72}\\u{65}\\u{65}\\u{2c}\\u{20}\\u{4d}\\u{6f}\\u{64}\\u{65}\\u{72}\\u{6e}\\u{20}\\u{54}\\u{6f}\\u{6f}\\u{6c}\\u{62}\\u{6f}\\u{78}\\u{0a}\\u{42}\\u{75}\\u{69}\\u{6c}\\u{74}\\u{20}\\u{66}\\u{6f}\\u{72}\\u{20}\\u{44}\\u{65}\\u{76}\\u{65}\\u{6c}\\u{6f}\\u{70}\\u{65}\\u{72}\\u{73}\\u{2e}\\u{0a}`;

export default textTransformTool({
  inputHandler: decode,
  resultHandler: encode,
  sampleData: EXAMPLE_ENCODED,
  autoFillInputCondition: isUtf16Encoded,
});

export const advance = {
  recommendHook(str: string) {
    if (isUtf16Encoded(str)) {
      return 4;
    } else {
      return 0;
    }
  },
};
