
import {JsonExample, textTransformTool} from '@he3-kit/utils'
export default textTransformTool({
    sampleData: JsonExample,
    inputHandler: extractStrings
});
function extractStrings(data) {
    let result = [];
    const parsedData = JSON.parse(data);
    function traverse(obj) {
      for (let key in obj) {
        if (typeof obj[key] === 'string') {
          result.push(obj[key]);
        } else if (typeof obj[key] === 'object') {
          traverse(obj[key]);
        }
      }
    }
    traverse(parsedData);
    return result.join(',');
  }