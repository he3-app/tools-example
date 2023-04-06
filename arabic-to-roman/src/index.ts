import { textTransformTool } from '@he3-kit/utils';
import RomanNumerals from 'roman-numerals';

export default textTransformTool({
  sampleData: `12
392
10
5`,
  inputHandler: (str) => {
    const results = [];
    str.split('\n').forEach((line) => {
      const arabicNumber = parseInt(line, 10);
      if (!isNaN(arabicNumber) && arabicNumber >= 1 && arabicNumber <= 3999) {
        results.push(RomanNumerals.toRoman(arabicNumber));
      } else {
        results.push('Invalid number');
      }
    });
    return results.join('\n');
  },
  resultHandler: (str) => {
    const results = [];
    str.split('\n').forEach((line) => {
      try {
        results.push(RomanNumerals.toArabic(line));
      } catch (error) {
        results.push('Invalid Roman numeral');
      }
    });
    return results.join('\n');
  },
});
