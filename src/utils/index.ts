
export const isFalseValue = (value: unknown) => (value === 0 ? false : !value);

export const isVoid = (value: unknown) => {
  return value === undefined || value === null || value === "";
};