import { DateOption } from 'src/common/enums/date-option';

export function getDate(date_created: DateOption): Date {
  let currentDate = new Date();
  switch (date_created) {
    case DateOption.WEEK:
      currentDate.setDate(currentDate.getDate() - 7);
      break;
    case DateOption.MONTH:
      currentDate.setMonth(currentDate.getMonth() - 1);
      break;
    case DateOption.YEAR:
      currentDate.setFullYear(currentDate.getFullYear() - 1);
      break;
    default:
      currentDate = null;
  }
  return currentDate;
}
