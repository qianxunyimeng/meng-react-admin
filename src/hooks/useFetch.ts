import { useAsync } from "./useAsync";

const DEFAULT_OPTIONS = {
  headers: { "Content-Type": "application/json" },
};

/**
 * useFetch允许组件处理从 URL 获取数据并跟踪loading、error和value状态
 * @param url 要从中获取数据的endpoint的 URL
 * @param options 是一个包含选项的对象，例如获取请求的headers、method和body
 * @param dependencies 侦听更改的依赖项数组。回调函数将在任何依赖项更改时执行
 * @returns 
 * @example
 * const [id, setId] = useState(1)
  const { loading, error, value } = useFetch(
    `https://jsonplaceholder.typicode.com/todos/${id}`,
    {},
    [id]
  )
 */
export const useFetch = (url:string, options = {}, dependencies = []) => {
  return useAsync(() => {
    return fetch(url, { ...DEFAULT_OPTIONS, ...options }).then((res) => {
      if (res.ok) return res.json();
      return res.json().then((json) => Promise.reject(json));
    });
  }, dependencies);
};
