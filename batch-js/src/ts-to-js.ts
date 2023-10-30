import { transformTool } from '@he3-kit/utils';
import * as ts from 'typescript';

const sampleData = `const abc = (str:string) => {
  return str + str;
}`;

function tsToJs(tsCode) {
  const transpileOutput = ts.transpileModule(tsCode, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });
  return transpileOutput.outputText;
}

export default transformTool({
  inputLang: 'JAVASCRIPT',
  outputLang: 'JAVASCRIPT',
  sampleData,
  inputHandler: tsToJs,
});

export const toolMetaInfo = {
  name: 'TypeScript to JavaScript',
  description: 'Convert TypeScript to JavaScript',
  keywords: ['typescript', 'javascript'],
};
