export const ensureArray = <T>(value: unknown, label: string): T[] => {
  if (!Array.isArray(value)) {
    throw new Error(`${label}가 배열 형태가 아닙니다.`);
  }
  return value as T[];
};

export const ensureObject = <T>(value: unknown, label: string): T => {
  if (typeof value !== 'object' || value === null) {
    throw new Error(`${label}가 객체 형태가 아닙니다.`);
  }
  return value as T;
};

