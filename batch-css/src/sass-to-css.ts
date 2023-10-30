import { transformTool } from '@he3-kit/utils';
import Sass from 'sass.js';

const option = {
  // Format output: nested, expanded, compact, compressed
  style: Sass.style.scss,
  // Decimal point precision for outputting fractional numbers
  // (-1 will use the libsass default, which currently is 5)
  precision: -1,
  // If you want inline source comments
  comments: false,
  // String to be used for indentation
  indent: '  ',
  // String to be used to for line feeds
  linefeed: '\n',
  // Treat source_string as SASS (as opposed to SCSS)
  indentedSyntax: true,
};
const sassToCSS = (input: string) => {
  return new Promise<string>((resolve, reject) => {
    Sass.compile(input, option, (result) => {
      if (result.status === 0) {
        resolve(result.text);
      } else {
        reject(result.message);
      }
    });
  });
};
const sampleData = `@mixin bgAndBorder($color) {
  background-color: $color;
  border: 1px solid darken($color, 10%);
}
.parent {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}
.child {
  @extend .parent;
  width: 100%;
  max-width: 600px;
  padding: 20px;

  @include bgAndBorder(#eaeaea);
}
@function calcWidth($percent) {
  @return percentage($percent / 12);
}
@for $i from 1 through 12 {
  .col-#{$i} {
    flex-basis: calcWidth($i);
    max-width: calcWidth($i);
  }
}
.container {
  @extend .parent;
}
.col-6 {
  @extend .child;
}
`;

export default transformTool({
  inputLang: 'CSS',
  outputLang: 'CSS',
  sampleData,
  inputHandler: sassToCSS,
});

export const toolMetaInfo = {
  name: 'Less to CSS',
  description: 'Convert Less to CSS.',
  keywords: ['less', 'css', 'conversion'],
};
