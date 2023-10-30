import { transformTool } from '@he3-kit/utils';
import cssToStylus from 'css-to-stylus-converter';
import less from 'less';

const converterOptions = {
  unprefix: false,
  indent: 2,
  keepColons: true,
  cssSyntax: false,
  separateRules: false,
  removeComments: true,
  colorVariables: false,
};

const lessToStylus = async (input: string): Promise<string> => {
  try {
    const { css } = await less.render(input);
    return cssToStylus(css, converterOptions);
  } catch (error) {
    return Promise.reject(error);
  }
};

const sampleData = `.units {
  cancels-to-nothing: (1px / 1px);
  cancels: ((((10px / 5em) / 1px) * 3em) * 1px);
}
`;

export default transformTool({
  inputLang: 'CSS',
  outputLang: 'CSS',
  sampleData,
  inputHandler: lessToStylus,
});

export const toolMetaInfo = {
  name: 'Less to CSS',
  description: 'Convert Less to CSS.',
  keywords: ['less', 'css', 'conversion'],
};
