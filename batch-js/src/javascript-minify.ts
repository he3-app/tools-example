import { transformTool } from '@he3-kit/utils';
import { minify } from 'terser';
import beautify from 'js-beautify';
import { sampleData } from './utils/sample';
const prettifyJS = (inputValue: string) =>
  beautify.js(inputValue, {
    indent_size: 2,
  });

const minifyJS = async (inputValue: string) => {
  const { code } = await minify(inputValue, {
    mangle: false,
  });
  return code ?? '';
};

export default transformTool({
  inputLang: 'JAVASCRIPT',
  outputLang: 'JAVASCRIPT',
  sampleData: sampleData.minify,
  inputHandler: minifyJS,
  resultHandler: prettifyJS
});
