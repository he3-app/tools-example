import { promptboot } from '@he3-kit/utils';
import {TweetOptimizerTool} from './utils/prompt';

export default promptboot({
  prompt: TweetOptimizerTool.trim(),
});
