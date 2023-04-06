import { textTransformTool } from '@he3-kit/utils';
import pluralize from 'pluralize';

export default textTransformTool({
  sampleData: 'word\ncell',
  inputHandler: (str) => {
    const results = [];
    str.split('\n').forEach((line) => {
      results.push(pluralize.plural(line));
    });
    return results.join('\n');
  },
  resultHandler: (str) => {
    const results = [];
    str.split('\n').forEach((line) => {
      results.push(pluralize.singular(line));
    });
    return results.join('\n');
  },
});
