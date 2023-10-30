// Write by GPT4
import { transformTool } from '@he3-kit/utils';
import less from 'less';

function formatLess(lessString) {
  // 将 { 前后的空格去掉
  lessString = lessString.replace(/\s*{\s*/g, '{').replace(/\s*}\s*/g, '}');
  // 将 ; 后的空格去掉
  lessString = lessString.replace(/\s*;\s*/g, ';');
  // 将 , 后的空格去掉
  lessString = lessString.replace(/\s*,\s*/g, ',');
  // 将 : 后的空格去掉
  lessString = lessString.replace(/\s*:\s*/g, ':');
  // 将属性和值之间的空格去掉
  lessString = lessString.replace(/\s*:\s*/g, ':');
  // 将多个空格合并为一个空格
  lessString = lessString.replace(/\s+/g, ' ');

  return lessString;
}

const stylusToCSS = (input: string) => {
  return formatLess(input);
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
  inputHandler: stylusToCSS,
});

export const toolMetaInfo = {
  name: 'Stylus to CSS',
  description: 'Convert Stylus to CSS.',
  keywords: ['stylus', 'css', 'conversion'],
};
