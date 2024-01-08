import { promptboot } from '@he3-kit/utils';
import {PersonalLearningPlan} from './utils/prompt';

export default promptboot({
  prompt: PersonalLearningPlan.trim(),
});
