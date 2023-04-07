import Index from './index.vue';
export default Index;

export const advance = {
  recommend: {
    type: 'url',
    priority: 4,
  },

  conversionFunction:(input:string)=>{
    return decodeURI(input)
  }
};