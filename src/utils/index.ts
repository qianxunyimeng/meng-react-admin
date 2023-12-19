
export const isFalse = (value: unknown) => (value === 0 ? false : !value);

/** 是否是无效值 */
export const isVoid = (value: unknown) => {
  return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
};

/** 清理对象上的无效属性值(空值) */
export const cleanObject = (obj: Record<string, unknown>) => {
  const copyObj = {...obj}
  Object.keys(copyObj).forEach((key) => {
    if (isVoid(obj[key])) {
      delete copyObj[key];
    }
  });
  return copyObj;
}