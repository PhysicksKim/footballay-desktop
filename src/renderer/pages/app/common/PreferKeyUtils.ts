export const isValidKeyFormat = (key: string): boolean => {
  const regex = /^[A-Za-z0-9]{32}$/;
  return regex.test(key);
};
