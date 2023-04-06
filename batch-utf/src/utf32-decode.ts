import { textTransformTool } from '@he3-kit/utils';

import { decode, encode, isUtf32Encoded } from './utf32';

const EXAMPLE_DATA =
  'U+00000041U+00000020U+00000046U+00000072U+00000065U+00000065U+0000002cU+00000020U+0000004dU+0000006fU+00000064U+00000065U+00000072U+0000006eU+00000020U+00000054U+0000006fU+0000006fU+0000006cU+00000062U+0000006fU+00000078U+0000000aU+00000042U+00000075U+00000069U+0000006cU+00000074U+00000020U+00000066U+0000006fU+00000072U+00000020U+00000044U+00000065U+00000076U+00000065U+0000006cU+0000006fU+00000070U+00000065U+00000072U+00000073U+0000002eU+0000000a';

export default textTransformTool({
  inputHandler: decode,
  resultHandler: encode,
  sampleData: EXAMPLE_DATA,
  autoFillInputCondition: isUtf32Encoded,
});
