import { useEffect, useRef, useState } from "react"

/**
 * 
 * @param callback 
 */
export const useMounted = (callback:()=> void) => {
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

}
/**
 * 
 * @param value useState Value
 * @param delay 延迟debounce 延迟时间
 * @returns debounceValue
 * 
 * @example
 * ```
 * const [name,setName] = useState('')
 * const debounceName = useDebounce(name,200)
 * useEffect(() => {
 *  发送ajax请求获取数据
 * },[debounceName])
 * ```
 */
export const useDebounce = <T>(value:T,delay?:number) => {
  const [debounceValue, setDebounceValue] = useState(value)
  
  useEffect(() => {
    const timeout = setTimeout(() => setDebounceValue(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])
  
  return debounceValue
}

/**
 * 设置网页title
 * @param title 
 * @param keepOUnmount 
 */
export const useDocumentTitle = (
  title: string,
  keepOUnmount: boolean = true
) => {
  const oldTitle = useRef(document.title).current;

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (!keepOUnmount) {
        document.title = oldTitle;
      }
    };
  }, [keepOUnmount, oldTitle]);
};

export const useArray = <T>(initialArray:T[]) => {
  const [value, setValue] = useState<T[]>(initialArray);
  return {
    value,
    setValue,
    add: (item: T) => setValue([...value, item]),
    clear: () => setValue([]),
    // slice不会改变原数组
    removeIndex: (index: number) => setValue([...value.slice(0, index), ...value.slice(index + 1)]),
  };
}