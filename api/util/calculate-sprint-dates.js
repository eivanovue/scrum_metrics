const dayjs = require('dayjs');

const calculateSprintDates = (sprintStartDate) => {
  const DATE_FORMAT = 'dddd, MMMM D, YYYY';
  // Day of Week (Sunday as 0, Saturday as 6)
  const DAYS_TO_IGNORE = [0, 6];
  if (sprintStartDate) {
    const start = dayjs(sprintStartDate);
    const end = start.add(13, 'day');
    const duration = end.diff(start, 'days') + 1;
    let left = end.diff(dayjs(), 'days') + 1;
    let day = 0;

    const datesInSprint = Array(duration).fill(0).map((_, i) => i + 0).map((days) => {
      if (DAYS_TO_IGNORE.includes(start.add(days, 'days').get('day'))) {
        return null;
      } else {
        const nextDate = start.add(days, 'days').format(DATE_FORMAT)
        day += 1;
        return {
          day,
          date: nextDate,
        };
      }
    }).filter(date => date !== null);

    if (left <= 0) {
      left = 0;
    }

    return {
      sprintStartDate: start.format(DATE_FORMAT),
      sprintEndDate: end.format(DATE_FORMAT),
      sprintDuration: duration,
      datesInSprint,
      daysRemaning: left,
    }
  }
  return null;
}

module.exports = calculateSprintDates;