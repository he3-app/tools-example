import { promptboot } from '@he3-kit/utils';
import {SocialMediaCommentGenerator} from './utils/prompt';

export default promptboot({
  prompt: SocialMediaCommentGenerator.trim(),
});
