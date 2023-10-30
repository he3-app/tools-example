import { transformTool } from '@he3-kit/utils';
import unescapeJS from 'unescape-js';
const sampleData =
  'function copyHandler() {\n' +
  '  if (!output.value) {\n' +
  '    return\n' +
  '  }\n' +
  '  copy(fileType.TEXT, output.value)\n' +
  "  message.success('Copy Success')\n" +
  '}';

const jsEscape = (str: string) => {
  return str.replace(/[\0\u0008\u0009\u001A\n\r"'\\\%]/g, (char) => {
    switch (char) {
      case '\0':
        return '\\0';
      case '\u0008':
        return '\\b';
      case '\u0009':
        return '\\t';
      case '\u001A':
        return '\\z';
      case '\n':
        return '\\n';
      case '\r':
        return '\\r';
      case '\v':
        return '\\v';
      case '\f':
        return '\\f';
      case '"':
      case "'":
      case '\\':
      case '%':
        // prepends a backslash to backslash, percent, and double/single quotes
        return `\\${char}`;
    }
  });
};

export default transformTool({
  inputLang: 'JAVASCRIPT',
  outputLang: 'JAVASCRIPT',
  sampleData,
  inputHandler: jsEscape,
});
