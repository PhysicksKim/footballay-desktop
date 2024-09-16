const dateToYearMonthDay = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 *
 * @param dateString new Date(date) 로 생성 가능한 모든 date string 을 받습니다.
 * @returns 'yyyy-MM-dd' 형식의 string
 */
const isoStringToLocalYearMonthDay = (dateString: string): string => {
  const dateObj = new Date(dateString);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  return `${year}-${month < 10 ? '0' : ''}${month}-${
    day < 10 ? '0' : ''
  }${day}`;
};

const isValidISOString = (date: string): boolean => {
  const dateObj = new Date(date);
  return dateObj.toISOString() === date;
};

const parseDateTimeString = (dateTimeString: string): Date => {
  // dateTimeString 형식: "YYYY-MM-DD HH:mm"
  const [datePart, timePart] = dateTimeString.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes);
};

export default dateToYearMonthDay;
export {
  isoStringToLocalYearMonthDay as isoStringToYearMonthDay,
  isValidISOString,
  parseDateTimeString,
};
