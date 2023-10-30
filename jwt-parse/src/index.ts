import Index from './index.vue';
export default Index;

function renderOnSearchHook() {
  return true;
}

export const advance = {
  renderOnSearchHook,
  recommend: {
    type: 'jwt',
    priority: 5,
  },
};
