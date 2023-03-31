import json2php from 'json2php';
import register from './utils/register';
import { parseErrorLine } from './utils/json2Yaml';

export default register({
  inputHandler: (str: string) => {
    try {
      const printer = json2php.make({
        linebreak: '\n',
        indent: '\t\t',
        shortArraySyntax: true,
      });
      return `<?php\n\n\t$data = ${printer(JSON.parse(str))};`;
    } catch (error: any) {
      parseErrorLine(error.message, str);
    }
  },
  lang: 'PHP',
});
