import { transformTool } from '@he3-kit/utils';
import Css from 'json-to-css';
import cssbeautify from 'cssbeautify';
const sampleData = `{
  "body": {
    "background-color": "#f0f0f0",
    "font-family": "Arial, sans-serif"
  },
  "h1": {
    "font-size": "24px",
    "color": "#333",
    "text-align": "center"
  }
}`;

function objectToCss(obj) {
  let css = JSON.parse(obj);
  const beautifiedCss = cssbeautify(Css.of(css), {
    indent: '  ', //缩进为两个空格
    openbrace: 'end-of-line', //左大括号放在行尾
    autosemicolon: true, //自动插入分号
  });
  return beautifiedCss;
}

export default transformTool({
  inputLang: 'CSS',
  outputLang: 'JAVASCRIPT',
  inputHandler: objectToCss,
  sampleData,
});

export const toolMetaInfo = {
  name: 'CSS to JS Object',
  description: 'Convert CSS to Javascript Object',
  keywords: ['css', 'javascript', 'object'],
};
