import { promptboot } from '@he3-kit/utils';
import {HighSchoolMaxScoreEssayGenerator} from './utils/prompt';

export default promptboot({
  prompt: HighSchoolMaxScoreEssayGenerator.trim(),
});
