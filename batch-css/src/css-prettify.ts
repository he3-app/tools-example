import { transformTool } from '@he3-kit/utils';
import beautify from 'js-beautify';
import { sampleData } from './utils/sample';
import { minify } from 'csso';
const prettifyCSS = (inputValue: string) =>
  beautify.css(inputValue, {
    indent_size: 2,
  });
const minifyCSS = (inputValue: string) => minify(inputValue).css
export default transformTool({
  inputLang: 'CSS',
  outputLang: 'CSS',
  sampleData: sampleData.prettify,
  inputHandler: prettifyCSS,
  resultHandler: minifyCSS
});
