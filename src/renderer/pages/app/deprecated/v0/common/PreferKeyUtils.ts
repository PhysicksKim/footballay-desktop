export const PREFERENCE_KEY_LENGTH = 32;

export const PREFERENCE_KEY_VALID_CONDITION_MESSAGE = `영문 대소문자 및 숫자 ${PREFERENCE_KEY_LENGTH}자리`;

export const isValidKeyFormat = (key: string): boolean => {
  const regex = /^[A-Za-z0-9]{32}$/; // 영문 대소문자 및 숫자 32자리
  return regex.test(key);
};

export const isKeyLengthValid = (key: string): boolean => {
  return key.length === PREFERENCE_KEY_LENGTH;
};
