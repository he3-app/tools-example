import { transformTool } from '@he3-kit/utils';

import css2less from 'css2less';

const options = {
  indentSize: 2,
  indentChar: ' ',
};
const CSSToLess = function (input: string) {
  return css2less(input, options);
};

const sampleData = `body {
  font-family: Arial, sans-serif;
  color: #333;
}

h1 {
  font-size: 2em;
  margin: 0 0 1em;
}
p {
  margin: 0 0 1em;
}

/* Grid styles */
.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -1em;
}

.col {
  flex-basis: 100%;
  max-width: 100%;
  padding: 0 1em;
}

@media (min-width: 600px) {
  .col--half {
    flex-basis: calc(50% - 2em);
    max-width: calc(50% - 2em);
  }
}

@media (min-width: 900px) {
  .col--third {
    flex-basis: calc(33.3333% - 2em);
    max-width: calc(33.3333% - 2em);
  }
}`;

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
