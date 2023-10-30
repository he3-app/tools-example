// Write by GPT4
import { transformTool } from '@he3-kit/utils';

import cssToStylus from 'css-to-stylus-converter';
const converterOptions = {
  unprefix: true,
  indent: -1,
  keepColons: true,
  cssSyntax: true,
  separateRules: true,
  removeComments: true,
  colorVariables: true,
};
const stylusToCSS = (input: string) => {
  return cssToStylus(input, converterOptions);
};

const sampleData = `button 
  -webkit-border-radius: 10px 15px;
  -moz-border-radius: 10px 15px;
  border-radius: 10px 15px;
`; /* `$base-font-size = 16px
$primary-color = #4caf50

body
  font-size: $base-font-size
  color: #333

.container
  max-width: 1200px
  margin: 0 auto

.btn
  display: inline-block
  padding: 10px 20px
  border-radius: 4px
  color: #fff
  background-color: $primary-color
  text-decoration: none
  &:hover
    background-color: darken($primary-color, 10%)

@media screen and (max-width: 768px)
  .container
    max-width: 100%
  .btn
    display: block
    width: 100%
`; */

export default transformTool({
  inputLang: 'CSS',
  outputLang: 'CSS',
  sampleData,
  inputHandler: stylusToCSS,
});

export const toolMetaInfo = {
  name: 'Stylus to CSS',
  description: 'Convert Stylus to CSS.',
  keywords: ['stylus', 'css', 'conversion'],
};
