import { uglyJsonExample } from './example';
import register from './utils/register';

function formatJson(jsonString: string, indent: number = 2): string {
  let result = '';
  let indentLevel = 0;
  let inString = false;
  let currentChar = '';

  for (let i = 0, length = jsonString.length; i < length; i++) {
    currentChar = jsonString.charAt(i);

    switch (currentChar) {
      case '{':
      case '[':
        if (!inString) {
          result += currentChar + '\n' + getIndent(++indentLevel, indent);
        } else {
          result += currentChar;
        }
        break;
      case '}':
      case ']':
        if (!inString) {
          result += '\n' + getIndent(--indentLevel, indent) + currentChar;
        } else {
          result += currentChar;
        }
        break;
      case ',':
        if (!inString) {
          result += ',\n' + getIndent(indentLevel, indent);
        } else {
          result += currentChar;
        }
        break;
      case ':':
        if (!inString) {
          result += ': ';
        } else {
          result += currentChar;
        }
        break;
      case ' ':
      case '\n':
      case '\t':
        if (inString) {
          result += currentChar;
        }
        break;
      case '"':
        inString = !inString;
        result += currentChar;
        break;
      default:
        result += currentChar;
        break;
    }
  }

  return result;
}

function getIndent(indentLevel: number, indentSize: number): string {
  return ' '.repeat(indentLevel * indentSize);
}



export default register({
  inputHandler: formatJson,
  lang: 'JSON',
  example: uglyJsonExample,
});

export const advance = {
  recommend: {
    type: 'json',
    priority: 5,
  },
};
