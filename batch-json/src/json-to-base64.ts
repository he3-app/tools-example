import { textTransformTool } from '@he3-kit/utils';
import { Buffer } from 'buffer';
import { fromByteArray } from 'base64-js';
import {JsonExample, isJson} from '@he3-kit/utils'
export default textTransformTool({
    inputHandler: extractStrings,
    sampleData: JsonExample,
    autoFillInputCondition: isJson,
});
function extractStrings(data) {
    const bytes = Buffer.from(data, 'utf-8');
    return fromByteArray(bytes);
  }