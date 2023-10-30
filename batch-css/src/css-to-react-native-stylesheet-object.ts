import { transformTool } from '@he3-kit/utils';
import parse from 'style-to-js';
import transform from 'css-to-react-native';
import postcss from "postcss";
import postcssJs from "postcss-js";

const toJSSObject = (cssText) => {
  const root = postcss.parse(cssText);
  return postcssJs.objectify(root);
};


const toRN = (cssText) => {
  try {
    const output = toJSSObject(cssText);
    const result = Object.keys(output).map((rules) => [rules, output[rules]]);
    return JSON.stringify(transform(result), null, 2);
  } catch (e) {
    return "Error translating CSS to RN";
  }
};

function cssToReactNativeStylesheetObject(css: string) {
    console.log('%ccss-to-react-native.ts line:5 css', 'color: #007acc;', css);

  return toRN(css)
}


const sampleData = `text-shadow-offset: 10px 5px;
font-variant: small-caps;
transform: translate(10px, 5px) scale(5);
`;

export default transformTool({
  inputLang: 'CSS',
  outputLang: 'JAVASCRIPT',
  inputHandler: cssToReactNativeStylesheetObject,
  sampleData,
});

export const toolMetaInfo = {
  name: 'CSS to React Native Stylesheet Objects',
  description: 'Convert CSS to React Native Stylesheet Objects',
  keywords: ['css',  'React Native', 'stylesheet'],
};
