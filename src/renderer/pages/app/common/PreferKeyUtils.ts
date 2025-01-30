export const PREFENCE_KEY_LENGTH = 32;

export const isValidKeyFormat = (key: string): boolean => {
  const regex = /^[A-Za-z0-9]{32}$/;
  return regex.test(key);
};

export const isKeyLengthValid = (key: string): boolean => {
  return key.length === PREFENCE_KEY_LENGTH;
};
