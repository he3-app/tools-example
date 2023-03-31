import Index from './index.vue';
import { isCommonPorts } from './ports';
export default Index;

function searchHook(str) {
  if (isCommonPorts(str)) {
    return 5;
  }
}

function renderOnSearchHook(str) {
  return isCommonPorts(str);
}

export const advance = {
  searchHook,
  renderOnSearchHook,
  recommend: {
    type: 'text',
    priority: 5,
    extraCondition(str, props) {
      return isCommonPorts(str);
    },
  },
};
