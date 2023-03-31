import register from './utils/register';

export default register({
  inputHandler: async (str: string) => {
    return await window.$he3.jsonToOther('swift', str);
  },
  lang: 'SWIFT',
});
