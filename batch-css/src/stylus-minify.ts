import { transformTool } from '@he3-kit/utils';
import { compile, serialize, stringify, middleware, prefixer } from 'stylis';

const stylusMinify = (input: string) => {
  return serialize(compile(input), middleware([prefixer, stringify]));
};

const sampleData = `$base-font-size = 16px
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
`;

export default transformTool({
  inputLang: 'CSS',
  outputLang: 'CSS',
  sampleData,
  inputHandler: stylusMinify,
});

export const toolMetaInfo = {
  name: 'Stylus Minify',
  description: 'Stylus Minify',
  keywords: ['Stylus', 'Minify', 'conversion'],
};
