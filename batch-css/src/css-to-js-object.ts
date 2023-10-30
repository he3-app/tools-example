import { transformTool } from '@he3-kit/utils';
import parse from 'style-to-js';
function cssToJavascriptObject(css: string) {
  return JSON.stringify(parse(css), null, 2);
}
const sampleData = `background-color: #BADA55;
color: #BADA55;
`;
export default transformTool({
  inputLang: 'CSS',
  outputLang: 'JAVASCRIPT',
  inputHandler: cssToJavascriptObject,
  sampleData,
});

export const toolMetaInfo = {
  name: 'CSS to JS Object',
  description: 'Convert CSS to Javascript Object',
  keywords: ['css', 'javascript', 'object'],
};
