// Write by GPT4
import { transformTool } from '@he3-kit/utils';
import cssbeautify from 'cssbeautify';

const stylusToCSS = (input: string) => {
  return cssbeautify(input, {
    indent: '  ',
    autosemicolon: true,
  });
};

const sampleData = `.units{cancels-to-nothing:(1px / 1px);cancels:((((10px / 5em) / 1px) * 3em) * 1px);}`;

export default transformTool({
  inputLang: 'CSS',
  outputLang: 'CSS',
  sampleData,
  inputHandler: stylusToCSS,
});

export const toolMetaInfo = {
  name: 'Stylus to CSS',
  description: 'Convert Stylus to CSS.',
  keywords: ['stylus', 'css', 'conversion'],
};
