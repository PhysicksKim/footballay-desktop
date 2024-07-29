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

export default dateToYearMonthDay;
export {
  isoStringToLocalYearMonthDay as isoStringToYearMonthDay,
  isValidISOString,
};
