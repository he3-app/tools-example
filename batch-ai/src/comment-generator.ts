// import { promptboot } from '../../../../packages/utils/src/utils/promptboot';
import { promptboot } from '@he3-kit/utils';
import prompt from './utils/prompt';

export default promptboot({
  prompt: prompt.commentGenerator.trim(),
});
