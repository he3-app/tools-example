import { transformTool } from '@he3-kit/utils';
import { minify } from 'csso';
import beautify from 'js-beautify';
import { sampleData } from './utils/sample';
const prettifyCSS = (inputValue: string) =>
  beautify.css(inputValue, {
    indent_size: 2,
  });
const minifyCSS = (inputValue: string) => minify(inputValue).css;
export default transformTool({
  inputLang: 'CSS',
  outputLang: 'CSS',
  sampleData: sampleData.minify,
  inputHandler: minifyCSS,
  resultHandler: prettifyCSS,
});
