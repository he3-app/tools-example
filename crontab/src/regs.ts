import { isValidCron } from 'cron-validator';
import cronValidate from 'cron-validate';
export function isCron(res) {
  return Cron(res);
}
function Cron(str: string) {
  // str not empty
  if (!str) {
    return false;
  }
  const options = {
    alias: true,
    seconds: true,
    allowBlankDay: true,
    allowSevenAsSunday: true,
  };
  const cronResult = isValidCron(str, options);

  const cronValidateOptions = {
    override: {
      useSeconds: true,
      useYears: true,
      useAliases: true, // optional, default to false
      useBlankDay: true,
      allowOnlyOneBlankDayField: true,
      mustHaveBlankDayField: true, // optional, default to false
      useLastDayOfMonth: true, // optional, default to false
      useLastDayOfWeek: true, // optional, default to false
      useNearestWeekday: true, // optional, default to false
      useNthWeekdayOfMonth: true, // optional, default to false
    },
  };
  const cronValidateResult = cronValidate(str, cronValidateOptions);
  return cronResult || cronValidateResult.isValid();
}
