import { promptboot } from '@he3-kit/utils';
import {ThankYouLetterGenerator} from './utils/prompt';

export default promptboot({
  prompt: ThankYouLetterGenerator.trim(),
});
