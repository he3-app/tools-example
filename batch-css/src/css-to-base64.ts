import { transformTool } from '@he3-kit/utils';
import { encode } from 'js-base64';

const CSSToLess = function (input: string) {
  return encode(input);
};

const sampleData = `.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.text {
  font-size: 16px;
  line-height: 1.5;
  color: #333;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #0069d9;
}
`;

export default transformTool({
  inputLang: 'CSS',
  outputLang: 'CSS',
  sampleData,
  inputHandler: CSSToLess,
});

export const toolMetaInfo = {
  name: 'Less to CSS',
  description: 'Convert Less to CSS.',
  keywords: ['less', 'css', 'conversion'],
};
