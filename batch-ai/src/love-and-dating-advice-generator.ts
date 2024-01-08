import { promptboot } from '@he3-kit/utils';
import {LoveAndDatingAdviceGenerator} from './utils/prompt';

export default promptboot({
  prompt: LoveAndDatingAdviceGenerator.trim(),
});
