import { useCallback, useEffect, useState } from "react";

/**
 * ```
 * 处理组件异步操作并跟踪loading、error和value状态。
 * 该钩子返回三个状态变量：loading、error和value。加载状态用于指示异步操作当前是否正在进行，错误状态用于在Promise被reject的情况下存储错误对象，而值状态用于在Promise 成功返回的情况下存储已解析的值.
 * ```
 * @param callback  - 是一个返回Promise的函数，该函数负责执行异步操作
 * @param dependencies - 侦听更改的依赖项数组。回调函数将在任何依赖项更改时执行
 * @returns 
 * @example
 * function AsyncComponent() {
 * const { loading, error, value } = useAsync(() => {
 *   return new Promise((resolve, reject) => {
 *     const success = false
 *     setTimeout(() => {
 *       success ? resolve("Hi") : reject("Error")
 *     }, 1000)
 *   })
 * })
 *
 * return (
 *   <div>
 *     <div>Loading: {loading.toString()}</div>
 *     <div>{error}</div>
 *     <div>{value}</div>
 *   </div>
 * )
 * }
 */
export const useAsync = <T = any>(callback:() => Promise<T>, dependencies = []) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [value, setValue] = useState<T>();

  const callbackMemoized = useCallback(() => {
    setLoading(true);
    setError(undefined);
    setValue(undefined);
    callback()
      .then(setValue)
      .catch(setError)
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => {
    callbackMemoized();
  }, [callbackMemoized]);

  return { loading, error, value };
};




