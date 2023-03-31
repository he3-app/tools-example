import { json2java } from './utils/json2javaBean';
import register from './utils/register';

export default register({
  lang: 'JAVA',
  inputHandler: (str: string) => {
    return json2java(str)
      ?.map((item) => item?.fileContent)
      .join('\r\n\r\n');
  },
});
