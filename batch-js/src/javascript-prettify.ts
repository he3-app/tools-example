import { transformTool } from '@he3-kit/utils';
import beautify from 'js-beautify';
import { minify } from 'terser';
import { sampleData } from './utils/sample';
const minifyJS = async (inputValue: string) => {
  const { code } = await minify(inputValue, {
    mangle: false,
  });
  return code ?? '';
};
const prettifyJS = (inputValue: string) =>
  beautify.js(inputValue, {
    indent_size: 2,
  });

export default transformTool({
  inputLang: 'JAVASCRIPT',
  outputLang: 'JAVASCRIPT',
  sampleData: sampleData.prettify,
  inputHandler: prettifyJS,
  resultHandler: minifyJS
});
